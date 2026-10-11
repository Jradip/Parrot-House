update public.site_settings
set value = jsonb_set(value, '{eyebrow}', to_jsonb('Tentang Parrot House'::text), true),
    updated_at = timezone('utc', now())
where key = 'about_page'
  and value ->> 'eyebrow' = 'About Parrot House';
