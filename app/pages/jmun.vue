<script setup lang="ts">
const {
  committees,
  status,
  error,
  eventDetails,
  formattedDate,
} = await useConferencePage('JMUN')

useSeoMeta({
  title: () => eventDetails.value?.name || 'JMUN 2027',
  ogTitle: () => eventDetails.value?.name || 'JMUN 2027 - Junior Model United Nations',
  description: () => eventDetails.value?.description || 'Discover the committees and topics for JMUN 2027. The perfect introduction to diplomacy for middle school students at CIC.',
  ogDescription: () => eventDetails.value?.description || 'Discover the committees and topics for JMUN 2027. The perfect introduction to diplomacy for middle school students at CIC.',
})
</script>

<template>
  <ConferenceOverviewPage
    conference-type="JMUN"
    fallback-title="JMUN 2027"
    fallback-description="Junior Model United Nations"
    :event-details="eventDetails"
    :formatted-date="formattedDate"
    :committees="committees ?? []"
    :status="status"
    :has-error="Boolean(error)"
    empty-title="Official committee list not yet published"
    empty-description="JMUN 2027 is scheduled, but the official committee dataset has not been published yet. This page is ready to display it as soon as the content team releases the approved committee list."
  />
</template>
