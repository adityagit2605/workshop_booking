from django.urls import path
from statistics_app import api

urlpatterns = [
    path('public/', api.api_public_stats, name='api_public_stats'),
    path('team/', api.api_team_stats, name='api_team_stats'),
    path('team/<int:team_id>/', api.api_team_stats, name='api_team_stats_id'),
]
