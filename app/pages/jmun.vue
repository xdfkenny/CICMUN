<script setup lang="ts">
const {
  committees,
  status,
  error,
  eventDetails,
  formattedDate,
} = await useConferencePage('JMUN')

useSeoMeta({
  title: () => eventDetails.value?.name || 'JMUN 2026',
  ogTitle: () => eventDetails.value?.name || 'JMUN 2026 - Junior Model of United Nations',
  description: () => eventDetails.value?.description || 'Discover the committees and topics for JMUN 2026. The perfect introduction to diplomacy for middle school students at CIC.',
  ogDescription: () => eventDetails.value?.description || 'Discover the committees and topics for JMUN 2026. The perfect introduction to diplomacy for middle school students at CIC.',
})
</script>

<template>
  <ConferenceOverviewPage
    conference-type="JMUN"
    fallback-title="JMUN 2026"
    fallback-description="Junior Model of United Nations"
    :event-details="eventDetails"
    :formatted-date="formattedDate"
    :committees="committees ?? []"
    :status="status"
    :has-error="Boolean(error)"
    empty-title="Committees coming soon"
    empty-description="The JMUN committee lineup has not been finalized yet. Check back for the official publication."
  />
</template>
