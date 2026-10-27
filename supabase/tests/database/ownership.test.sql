begin;
-- The transaction owns only synthetic metadata rows, with no stored files.
set local storage.allow_delete_query = 'true';
create extension if not exists pgtap with schema extensions;
select plan(15);

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'owner-a@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'owner-b@example.test');
insert into public.profiles (id, username) values
  ('11111111-1111-4111-8111-111111111111', 'owner-a'),
  ('22222222-2222-4222-8222-222222222222', 'owner-b');
insert into public.projects (id, owner_id, name) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Private project');
insert into storage.objects (bucket_id, name) values
  ('avatars', '11111111-1111-4111-8111-111111111111/avatar.png');

set local role authenticated;
set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';
select is((select count(*)::int from public.projects), 0, 'User B cannot read user A projects');
select results_eq($$with changed as (update public.projects set name = 'Stolen' returning id) select count(*)::int from changed$$, array[0], 'User B cannot update user A projects');
select results_eq($$with removed as (delete from public.projects returning id) select count(*)::int from removed$$, array[0], 'User B cannot delete user A projects');
select throws_ok($$insert into public.projects (owner_id, name) values ('11111111-1111-4111-8111-111111111111', 'Forged')$$, '42501', null, 'User B cannot create a project for user A');
select is((select count(*)::int from public.profiles), 1, 'User B can read only their own profile');
select results_eq($$with changed as (update public.profiles set website = 'https://attacker.test' where id = '11111111-1111-4111-8111-111111111111' returning id) select count(*)::int from changed$$, array[0], 'User B cannot change user A profile');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('avatars', '11111111-1111-4111-8111-111111111111/forged.png')$$, '42501', null, 'User B cannot upload to user A avatar folder');
select results_eq($$with changed as (update storage.objects set name = '22222222-2222-4222-8222-222222222222/stolen.png' where bucket_id = 'avatars' returning id) select count(*)::int from changed$$, array[0], 'User B cannot move user A avatar');
select results_eq($$with removed as (delete from storage.objects where bucket_id = 'avatars' returning id) select count(*)::int from removed$$, array[0], 'User B cannot delete user A avatar');

set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
select lives_ok($$insert into public.projects (name) values ('My second project')$$, 'Owner can create a project');
select is((select count(*)::int from public.projects), 2, 'Owner can list their projects');
select lives_ok($$update public.projects set name = 'Renamed' where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$$, 'Owner can update their project');
select throws_ok($$update public.projects set owner_id = '22222222-2222-4222-8222-222222222222'$$, '42501', null, 'Owner cannot transfer projects to another user');
select lives_ok($$update storage.objects set name = '11111111-1111-4111-8111-111111111111/new.png' where bucket_id = 'avatars'$$, 'Owner can rename their avatar');
select results_eq($$with removed as (delete from public.projects returning id) select count(*)::int from removed$$, array[2], 'Owner can delete their projects');

select * from finish();
rollback;
