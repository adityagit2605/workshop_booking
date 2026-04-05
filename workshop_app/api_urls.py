from django.urls import re_path
from workshop_app import api

urlpatterns = [
    # Auth
    re_path(r'^auth/csrf/$', api.csrf_token, name='api_csrf'),
    re_path(r'^auth/login/$', api.api_login, name='api_login'),
    re_path(r'^auth/logout/$', api.api_logout, name='api_logout'),
    re_path(r'^auth/register/$', api.api_register, name='api_register'),
    re_path(r'^auth/user/$', api.api_current_user, name='api_current_user'),

    # Workshops
    re_path(r'^workshops/coordinator/$', api.api_coordinator_workshops,
        name='api_coordinator_workshops'),
    re_path(r'^workshops/instructor/$', api.api_instructor_workshops,
        name='api_instructor_workshops'),
    re_path(r'^workshops/propose/$', api.api_propose_workshop,
        name='api_propose_workshop'),
    re_path(r'^workshops/(?P<workshop_id>\d+)/accept/$', api.api_accept_workshop,
        name='api_accept_workshop'),
    re_path(r'^workshops/(?P<workshop_id>\d+)/change-date/$', api.api_change_workshop_date,
        name='api_change_workshop_date'),
    re_path(r'^workshops/(?P<workshop_id>\d+)/$', api.api_workshop_details,
        name='api_workshop_details'),
    re_path(r'^workshops/(?P<workshop_id>\d+)/comments/$', api.api_post_comment,
        name='api_post_comment'),

    # Workshop Types
    re_path(r'^workshop-types/$', api.api_workshop_type_list,
        name='api_workshop_type_list'),
    re_path(r'^workshop-types/(?P<workshop_type_id>\d+)/$', api.api_workshop_type_details,
        name='api_workshop_type_details'),
    re_path(r'^workshop-types/(?P<workshop_type_id>\d+)/tnc/$', api.api_workshop_type_tnc,
        name='api_workshop_type_tnc'),

    # Profile
    re_path(r'^profile/$', api.api_own_profile, name='api_own_profile'),
    re_path(r'^profile/(?P<user_id>\d+)/$', api.api_view_profile,
        name='api_view_profile'),
]
