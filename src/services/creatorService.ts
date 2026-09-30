import { api } from './api';
import type { SubmitCreatorApplication } from '../features/creator/types';

/**
 * Envio real do credenciamento de criador para o Django/DRF (multipart).
 * Os ficheiros só sobem uma vez, no fim do fluxo (ver CreatorApplicationFlow).
 */
export const submitCreatorApplication: SubmitCreatorApplication = async (app, onProgress) => {
  const form = new FormData();
  form.append('full_name', app.fullName.trim());
  form.append('institution', app.institution === 'other' ? app.institutionOther.trim() : app.institution);
  form.append('affiliation', app.affiliation);
  app.specialties.forEach((s) => form.append('specialties', s));
  form.append('authorship_accepted', String(app.authorshipAccepted));
  form.append('express_phone', `+244${app.expressPhone}`);
  form.append('plan', app.plan ?? '');
  if (app.documentFile) form.append('document', app.documentFile);
  if (app.sampleFile) form.append('sample', app.sampleFile);

  const { data } = await api.post<{ protocol: string; sla_hours: number }>(
    '/creators/applications/',
    form,
    {
      onUploadProgress: (e) => {
        if (e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    },
  );
  return { protocol: data.protocol, slaHours: data.sla_hours };
};
