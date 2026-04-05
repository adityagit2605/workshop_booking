import datetime as dt

from django.core.paginator import Paginator
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from workshop_app.models import Workshop, WorkshopType, states
from workshop_app.serializers import WorkshopSerializer
from teams.models import Team


def is_instructor(user):
    return user.groups.filter(name='instructor').exists()


@api_view(['GET'])
@permission_classes([AllowAny])
def api_public_stats(request):
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    show_workshops = request.GET.get('show_workshops')
    sort = request.GET.get('sort', 'date')

    if from_date and to_date:
        workshops = Workshop.objects.filter(
            date__range=(from_date, to_date), status=1
        ).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshoptype:
            workshops = workshops.filter(workshop_type_id=workshoptype)
    else:
        today = timezone.now()
        upto = today + dt.timedelta(days=15)
        workshops = Workshop.objects.filter(
            date__range=(today, upto), status=1
        ).order_by('date')

    if show_workshops and request.user.is_authenticated:
        if is_instructor(request.user):
            workshops = workshops.filter(instructor_id=request.user.id)
        else:
            workshops = workshops.filter(coordinator_id=request.user.id)

    # Chart data
    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)

    # Pagination
    page = request.GET.get('page', 1)
    paginator = Paginator(workshops, 30)
    page_obj = paginator.get_page(page)

    # Workshop types for filter dropdown
    all_types = WorkshopType.objects.all().order_by('name')
    type_choices = [{'id': wt.id, 'name': wt.name} for wt in all_types]

    # State choices for filter dropdown
    state_choices = [{'code': code, 'name': name} for code, name in states if code]

    return Response({
        'workshops': WorkshopSerializer(page_obj, many=True).data,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
        'start_index': page_obj.start_index(),
        'chart_data': {
            'states': ws_states,
            'state_counts': ws_count,
            'types': ws_type,
            'type_counts': ws_type_count,
        },
        'filter_options': {
            'workshop_types': type_choices,
            'states': state_choices,
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_team_stats(request, team_id=None):
    user = request.user
    teams = Team.objects.all()

    if team_id:
        team = teams.filter(id=team_id).first()
    else:
        team = teams.first()

    if not team:
        return Response({'error': 'No teams found'}, status=404)

    if not team.members.filter(user_id=user.id).exists():
        return Response({'error': 'You are not added to the team'}, status=403)

    member_workshop_data = {}
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(
            instructor_id=member.user.id).count()
        member_workshop_data[member.user.get_full_name()] = workshop_count

    all_teams_data = [{'id': t.id, 'name': f'Team {i+1}'}
                      for i, t in enumerate(teams)]

    return Response({
        'team_labels': list(member_workshop_data.keys()),
        'ws_count': list(member_workshop_data.values()),
        'all_teams': all_teams_data,
        'team_id': team.id
    })
