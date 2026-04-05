from django.contrib.auth.models import User
from rest_framework import serializers

from .models import (
    Profile, Workshop, WorkshopType,
    AttachmentFile, Comment, Testimonial, Banner
)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'title', 'institute', 'department', 'phone_number',
            'position', 'location', 'state', 'is_email_verified',
            'how_did_you_hear_about_us'
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class WorkshopTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopType
        fields = ['id', 'name', 'description', 'duration', 'terms_and_conditions']


class AttachmentFileSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = AttachmentFile
        fields = ['id', 'attachments', 'url']

    def get_url(self, obj):
        if obj.attachments:
            return obj.attachments.url
        return None


class WorkshopSerializer(serializers.ModelSerializer):
    coordinator_name = serializers.SerializerMethodField()
    coordinator_id = serializers.IntegerField(source='coordinator.id', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    workshop_type_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    institute = serializers.SerializerMethodField()

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'date', 'status', 'status_display',
            'tnc_accepted', 'workshop_type', 'workshop_type_name',
            'coordinator_id', 'coordinator_name', 'instructor_name',
            'institute'
        ]

    def get_coordinator_name(self, obj):
        return obj.coordinator.get_full_name()

    def get_instructor_name(self, obj):
        if obj.instructor:
            return obj.instructor.get_full_name()
        return None

    def get_workshop_type_name(self, obj):
        return str(obj.workshop_type)

    def get_status_display(self, obj):
        return obj.get_status()

    def get_institute(self, obj):
        if hasattr(obj.coordinator, 'profile'):
            return obj.coordinator.profile.institute
        return ''


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source='author.id', read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'comment', 'public', 'created_date',
            'author_id', 'author_name'
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name()
