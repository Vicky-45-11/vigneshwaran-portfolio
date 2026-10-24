import type { ComponentType } from 'react';
import type { ProjectVisual } from '../../data/portfolio';
import { TextDetectorVisual } from './visuals/TextDetectorVisual';
import { CampusNetworkVisual } from './visuals/CampusNetworkVisual';
import { MusicPlayerVisual } from './visuals/MusicPlayerVisual';
import { GeoVerseVisual } from './visuals/GeoVerseVisual';
import { CivicReportVisual } from './visuals/CivicReportVisual';
import { VoiceDictationVisual } from './visuals/VoiceDictationVisual';
import { NextLifeVisual } from './visuals/NextLifeVisual';

export const VISUALS: Record<ProjectVisual, { Component: ComponentType; caption: string }> = {
  'ai-text-detector': {
    Component: TextDetectorVisual,
    caption: 'Illustration of text being tokenized, scanned for patterns and classified as human-written or AI-generated.',
  },
  'campus-connect': {
    Component: CampusNetworkVisual,
    caption: 'Illustration of a network linking students with shared interests, skills and projects.',
  },
  'spotify-clone': {
    Component: MusicPlayerVisual,
    caption: 'Illustration of a music interface with search, album grid and playback bar, using original abstract artwork.',
  },
  geoverse: {
    Component: GeoVerseVisual,
    caption: 'Illustration of a rotating globe with place markers taking turns as the focus.',
  },
  'civiclens-ai': {
    Component: CivicReportVisual,
    caption: 'Illustration of a map with issue pins and a report moving from reported to resolved, using sample data.',
  },
  'murmur-voice-site': {
    Component: VoiceDictationVisual,
    caption: 'Illustration of a waveform and a transcript with filler words removed.',
  },
  'secondlife-ai': {
    Component: NextLifeVisual,
    caption: 'Illustration of a device and five next-life routes: repair, reuse, refurbish, donate and recycle.',
  },
};
