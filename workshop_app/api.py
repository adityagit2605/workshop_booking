from datetime import datetime

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.middleware.csrf import get_token
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .forms import UserRegistrationForm
from .models import (
    Profile, Workshop, WorkshopType,
    AttachmentFile, Comment
)
from .send_mails import send_email
from .serializers import (
    UserSerializer, WorkshopSerializer,
    WorkshopTypeSerializer, CommentSerializer,
    AttachmentFileSerializer, ProfileSerializer
)


def is_instructor(user):
    return user.groups.filter(name='instructor').exists()


# ─── Auth ───────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    return Response({'csrfToken': get_token(request)})


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid username/password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if not user.profile.is_email_verified:
        return Response(
            {'error': 'Email not verified', 'activation_pending': True},
            status=status.HTTP_403_FORBIDDEN
        )
    login(request, user)
    return Response({
        'message': 'Login successful',
        'user': UserSerializer(user).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([AllowAny])
def api_current_user(request):
    if request.user.is_authenticated:
        data = UserSerializer(request.user).data
        data['is_instructor'] = is_instructor(request.user)
        return Response(data)
    return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    form = UserRegistrationForm(request.data)
    if form.is_valid():
        username, password, key = form.save()
        new_user = authenticate(username=username, password=password)
        login(request, new_user)
        try:
            user_position = new_user.profile.position
            send_email(
                request, call_on='Registration',
                user_position=user_position,
                key=key
            )
        except Exception:
            pass
        return Response({
            'message': 'Registration successful. Check email for activation.',
            'activation_pending': True
        }, status=status.HTTP_201_CREATED)
    return Response(
        {'errors': form.errors},
        status=status.HTTP_400_BAD_REQUEST
    )


# ─── Workshops ──────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_coordinator_workshops(request):
    user = request.user
    if is_instructor(user):
        return Response({'error': 'Not a coordinator'}, status=status.HTTP_403_FORBIDDEN)
    workshops = Workshop.objects.filter(
        coordinator=user.id
    ).order_by('-date')
    return Response(WorkshopSerializer(workshops, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_instructor_workshops(request):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Not an instructor'}, status=status.HTTP_403_FORBIDDEN)
    today = timezone.now().date()
    workshops = Workshop.objects.filter(Q(
        instructor=user.id,
        date__gte=today,
    ) | Q(status=0)).order_by('-date')
    return Response({
        'workshops': WorkshopSerializer(workshops, many=True).data,
        'today': str(today)
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_propose_workshop(request):
    user = request.user
    if is_instructor(user):
        return Response({'error': 'Instructors cannot propose workshops'}, status=status.HTTP_403_FORBIDDEN)

    workshop_type_id = request.data.get('workshop_type')
    date_str = request.data.get('date')
    tnc_accepted = request.data.get('tnc_accepted', False)

    if not all([workshop_type_id, date_str, tnc_accepted]):
        return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        workshop_type = WorkshopType.objects.get(id=workshop_type_id)
    except WorkshopType.DoesNotExist:
        return Response({'error': 'Invalid workshop type'}, status=status.HTTP_400_BAD_REQUEST)

    if Workshop.objects.filter(
        date=date_str, workshop_type=workshop_type, coordinator=user
    ).exists():
        return Response({'error': 'Duplicate workshop'}, status=status.HTTP_400_BAD_REQUEST)

    workshop = Workshop.objects.create(
        coordinator=user,
        workshop_type=workshop_type,
        date=date_str,
        tnc_accepted=True,
        status=0
    )
    return Response({
        'message': 'Workshop proposed successfully',
        'workshop': WorkshopSerializer(workshop).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_accept_workshop(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Not an instructor'}, status=status.HTTP_403_FORBIDDEN)
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found'}, status=status.HTTP_404_NOT_FOUND)

    workshop.status = 1
    workshop.instructor = user
    workshop.save()
    return Response({
        'message': 'Workshop accepted!',
        'workshop': WorkshopSerializer(workshop).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_change_workshop_date(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Not an instructor'}, status=status.HTTP_403_FORBIDDEN)

    new_date_str = request.data.get('new_date')
    if not new_date_str:
        return Response({'error': 'new_date is required'}, status=status.HTTP_400_BAD_REQUEST)

    new_date = datetime.strptime(new_date_str, "%Y-%m-%d")
    if datetime.today() > new_date:
        return Response({'error': 'Date must be in the future'}, status=status.HTTP_400_BAD_REQUEST)

    workshop = Workshop.objects.filter(id=workshop_id)
    if not workshop.exists():
        return Response({'error': 'Workshop not found'}, status=status.HTTP_404_NOT_FOUND)

    workshop.update(date=new_date)
    return Response({'message': 'Workshop date updated'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_workshop_details(request, workshop_id):
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found'}, status=status.HTTP_404_NOT_FOUND)

    is_inst = is_instructor(request.user)
    if is_inst:
        comments = Comment.objects.filter(workshop=workshop)
    else:
        comments = Comment.objects.filter(workshop=workshop, public=True)

    return Response({
        'workshop': WorkshopSerializer(workshop).data,
        'comments': CommentSerializer(comments, many=True).data,
        'is_instructor': is_inst
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_post_comment(request, workshop_id):
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({'error': 'Workshop not found'}, status=status.HTTP_404_NOT_FOUND)

    comment_text = request.data.get('comment', '').strip()
    if not comment_text:
        return Response({'error': 'Comment cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

    public = request.data.get('public', True)
    if not is_instructor(request.user):
        public = True

    comment = Comment.objects.create(
        author=request.user,
        comment=comment_text,
        public=public,
        created_date=timezone.now(),
        workshop=workshop
    )
    return Response({
        'message': 'Comment posted',
        'comment': CommentSerializer(comment).data
    }, status=status.HTTP_201_CREATED)


# ─── Workshop Types ─────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def api_workshop_type_list(request):
    workshop_types = WorkshopType.objects.all().order_by('id')
    page = request.GET.get('page', 1)
    from django.core.paginator import Paginator
    paginator = Paginator(workshop_types, 12)
    page_obj = paginator.get_page(page)

    return Response({
        'results': WorkshopTypeSerializer(page_obj, many=True).data,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_workshop_type_details(request, workshop_type_id):
    try:
        wt = WorkshopType.objects.get(id=workshop_type_id)
    except WorkshopType.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    attachments = AttachmentFile.objects.filter(workshop_type=wt)
    return Response({
        'workshop_type': WorkshopTypeSerializer(wt).data,
        'attachments': AttachmentFileSerializer(attachments, many=True).data,
        'is_instructor': is_instructor(request.user)
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_workshop_type_tnc(request, workshop_type_id):
    try:
        wt = WorkshopType.objects.get(id=workshop_type_id)
    except WorkshopType.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'tnc': wt.terms_and_conditions})


# ─── Profile ────────────────────────────────────────────

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def api_own_profile(request):
    user = request.user
    profile = user.profile

    if request.method == 'GET':
        data = UserSerializer(user).data
        data['is_instructor'] = is_instructor(user)
        return Response(data)

    # PUT — update profile
    profile_data = request.data
    if 'first_name' in profile_data:
        user.first_name = profile_data['first_name']
    if 'last_name' in profile_data:
        user.last_name = profile_data['last_name']
    user.save()

    for field in ['title', 'institute', 'department', 'phone_number',
                  'position', 'location', 'state']:
        if field in profile_data:
            setattr(profile, field, profile_data[field])
    profile.save()

    return Response({
        'message': 'Profile updated',
        'user': UserSerializer(user).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_view_profile(request, user_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Only instructors can view profiles'},
                        status=status.HTTP_403_FORBIDDEN)
    try:
        target_profile = Profile.objects.get(user_id=user_id)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    workshops = Workshop.objects.filter(coordinator=user_id).order_by('date')
    target_user = User.objects.get(id=user_id)

    return Response({
        'user': UserSerializer(target_user).data,
        'workshops': WorkshopSerializer(workshops, many=True).data
    })
