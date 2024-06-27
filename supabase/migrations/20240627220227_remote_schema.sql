
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_partnerships_with_names"() RETURNS TABLE("created_at" timestamp with time zone, "inviter" "uuid", "invitee" "uuid", "inviter_name" "text", "invitee_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return query 
    SELECT
      p.*,
      inviter.name AS inviter_name,
      invitee.name AS invitee_name
    FROM
      partnerships AS p
      LEFT JOIN profiles AS inviter ON p.inviter = inviter.user_id
      LEFT JOIN profiles AS invitee ON p.invitee = invitee.user_id
    WHERE (p.inviter = auth.uid() OR p.invitee = auth.uid());
end;
$$;

ALTER FUNCTION "public"."get_partnerships_with_names"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("email" "text") RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
begin
  return query 
    select au.id 
      from auth.users au 
      where lower(au.email) = lower($1);
end;
$_$;

ALTER FUNCTION "public"."get_user_id_by_email"("email" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."entries (2022 archive)" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "who" "text",
    "points" numeric,
    "signature" "text",
    "comment" "text"
);

ALTER TABLE "public"."entries (2022 archive)" OWNER TO "postgres";

COMMENT ON TABLE "public"."entries (2022 archive)" IS 'blowjobs 💦';

COMMENT ON COLUMN "public"."entries (2022 archive)"."who" IS 'D or A';

ALTER TABLE "public"."entries (2022 archive)" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."entries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."partnerships" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "inviter" "uuid" NOT NULL,
    "invitee" "uuid" NOT NULL
);

ALTER TABLE "public"."partnerships" OWNER TO "postgres";

COMMENT ON TABLE "public"."partnerships" IS 'Relationships between two partners';

CREATE TABLE IF NOT EXISTS "public"."points" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "from" "uuid" NOT NULL,
    "to" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "comment" "text",
    "signature" "text"
);

ALTER TABLE "public"."points" OWNER TO "postgres";

ALTER TABLE "public"."points" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."points_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "name" "text",
    "active_partner" "uuid",
    "push_notif_subscriptions" "jsonb"[]
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."pub_keys" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "value" "text"
);

ALTER TABLE "public"."pub_keys" OWNER TO "postgres";

ALTER TABLE ONLY "public"."entries (2022 archive)"
    ADD CONSTRAINT "entries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."partnerships"
    ADD CONSTRAINT "partnerships_pkey" PRIMARY KEY ("inviter", "invitee");

ALTER TABLE ONLY "public"."points"
    ADD CONSTRAINT "points_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_userId_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."pub_keys"
    ADD CONSTRAINT "pub_keys_pkey" PRIMARY KEY ("created_at", "user_id");

ALTER TABLE ONLY "public"."partnerships"
    ADD CONSTRAINT "partnerships_invitee_fkey" FOREIGN KEY ("invitee") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."partnerships"
    ADD CONSTRAINT "partnerships_inviter_fkey" FOREIGN KEY ("inviter") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."points"
    ADD CONSTRAINT "points_from_fkey" FOREIGN KEY ("from") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."points"
    ADD CONSTRAINT "points_to_fkey" FOREIGN KEY ("to") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_active_partner_fkey" FOREIGN KEY ("active_partner") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."pub_keys"
    ADD CONSTRAINT "pub_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE POLICY "Can insert own pub_key" ON "public"."pub_keys" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Partners can read each other's pub keys" ON "public"."pub_keys" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR ("user_id" IN ( SELECT "partnerships"."inviter"
   FROM "public"."partnerships"
  WHERE ("partnerships"."invitee" = "auth"."uid"())
UNION
 SELECT "partnerships"."invitee"
   FROM "public"."partnerships"
  WHERE ("partnerships"."inviter" = "auth"."uid"())))));

CREATE POLICY "User can insert if 'from' = user_id" ON "public"."points" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "from"));

CREATE POLICY "User can read/write own profile" ON "public"."profiles" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can read own points" ON "public"."points" FOR SELECT USING ((("auth"."uid"() = "from") OR ("auth"."uid"() = "to")));

ALTER TABLE "public"."entries (2022 archive)" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."partnerships" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."points" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."pub_keys" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_partnerships_with_names"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_partnerships_with_names"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_partnerships_with_names"() TO "service_role";

REVOKE ALL ON FUNCTION "public"."get_user_id_by_email"("email" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email" "text") TO "service_role";

GRANT ALL ON TABLE "public"."entries (2022 archive)" TO "anon";
GRANT ALL ON TABLE "public"."entries (2022 archive)" TO "authenticated";
GRANT ALL ON TABLE "public"."entries (2022 archive)" TO "service_role";

GRANT ALL ON SEQUENCE "public"."entries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."entries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."entries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."partnerships" TO "anon";
GRANT ALL ON TABLE "public"."partnerships" TO "authenticated";
GRANT ALL ON TABLE "public"."partnerships" TO "service_role";

GRANT ALL ON TABLE "public"."points" TO "anon";
GRANT ALL ON TABLE "public"."points" TO "authenticated";
GRANT ALL ON TABLE "public"."points" TO "service_role";

GRANT ALL ON SEQUENCE "public"."points_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."points_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."points_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."pub_keys" TO "anon";
GRANT ALL ON TABLE "public"."pub_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."pub_keys" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
