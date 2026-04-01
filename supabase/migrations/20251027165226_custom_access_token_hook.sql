create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
  declare
    original_claims jsonb;
    new_claims jsonb;
    claim text;
  begin
    original_claims = event->'claims';
    new_claims = '{}'::jsonb;

    foreach claim in array array[
      -- add claims you want to keep here
      'iss',
      'aud',
      'exp',
      'iat',
      'sub',
      'role',
      'aal',
      'session_id',
      'email',
      'phone',
      'is_anonymous'
   ] loop
      if original_claims ? claim then
        -- original_claims contains one of the listed claims, set it on new_claims
        new_claims = jsonb_set(new_claims, array[claim], original_claims->claim);
      end if;
    end loop;

    return jsonb_build_object('claims', new_claims);
  end
$$;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

grant usage on schema public to supabase_auth_admin;