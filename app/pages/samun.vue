<script setup lang="ts">
import { siteConfig } from '~/config/siteConfig'

const {
  committees,
  status,
  error,
  eventDetails,
  formattedDate,
} = await useConferencePage('SAMUN')

useSeoMeta({
  title: () => eventDetails.value?.name || siteConfig.samun.name,
  ogTitle: () => eventDetails.value?.name || `${siteConfig.samun.name} - South American Model United Nations`,
  description: () => eventDetails.value?.description || `Explore the committees, topics, and resources for ${siteConfig.samun.name}. The flagship Model UN conference for high school delegates at CIC.`,
  ogDescription: () => eventDetails.value?.description || `Explore the committees, topics, and resources for ${siteConfig.samun.name}. The flagship Model UN conference for high school delegates at CIC.`,
})
</script>

<template>
  <ConferenceOverviewPage
    conference-type="SAMUN"
    :fallback-title="siteConfig.samun.name"
    fallback-description="South American Model United Nations"
    :event-details="eventDetails"
    :formatted-date="formattedDate"
    :committees="committees ?? []"
    :status="status"
    :has-error="Boolean(error)"
    empty-title="Official committee list not yet published"
    :empty-description="`${siteConfig.samun.name} is scheduled, but the official committee dataset has not been published yet. This page is ready to display it as soon as the content team releases the approved committee list.`"
  />
</template>