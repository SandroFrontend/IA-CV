--
-- PostgreSQL database dump
--

\restrict eF7rYnl5QYxHfgNgBU1IcGkf4bqY4IPKRqu9BUaztfXNZadifOVst9ZUxYav9wb

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."ItemRubrica" DROP CONSTRAINT IF EXISTS "ItemRubrica_escaparametroSessionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Actividad" DROP CONSTRAINT IF EXISTS "Actividad_username_fkey";
DROP INDEX IF EXISTS public."User_username_key";
DROP INDEX IF EXISTS public."User_nickname_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Test_name_key";
DROP INDEX IF EXISTS public."ItemRubrica_escaparametroSessionId_idx";
DROP INDEX IF EXISTS public."Actividad_token_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Test" DROP CONSTRAINT IF EXISTS "Test_pkey";
ALTER TABLE IF EXISTS ONLY public."ItemRubrica" DROP CONSTRAINT IF EXISTS "ItemRubrica_pkey";
ALTER TABLE IF EXISTS ONLY public."EscapareteSession" DROP CONSTRAINT IF EXISTS "EscapareteSession_pkey";
ALTER TABLE IF EXISTS ONLY public."Actividad" DROP CONSTRAINT IF EXISTS "Actividad_pkey";
ALTER TABLE IF EXISTS public."Actividad" ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Test";
DROP TABLE IF EXISTS public."ItemRubrica";
DROP TABLE IF EXISTS public."EscapareteSession";
DROP SEQUENCE IF EXISTS public."Actividad_id_seq";
DROP TABLE IF EXISTS public."Actividad";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Actividad; Type: TABLE; Schema: public; Owner: ico
--

CREATE TABLE public."Actividad" (
    id integer NOT NULL,
    code integer NOT NULL,
    nombre text NOT NULL,
    maxpoints integer DEFAULT 20 NOT NULL,
    token text NOT NULL,
    points integer NOT NULL,
    username text NOT NULL,
    "createdAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Actividad" OWNER TO ico;

--
-- Name: Actividad_id_seq; Type: SEQUENCE; Schema: public; Owner: ico
--

CREATE SEQUENCE public."Actividad_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Actividad_id_seq" OWNER TO ico;

--
-- Name: Actividad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ico
--

ALTER SEQUENCE public."Actividad_id_seq" OWNED BY public."Actividad".id;


--
-- Name: EscapareteSession; Type: TABLE; Schema: public; Owner: ico
--

CREATE TABLE public."EscapareteSession" (
    id uuid NOT NULL,
    equipo text NOT NULL,
    "casoId" text NOT NULL,
    descripcion text NOT NULL,
    "imagenPath" text NOT NULL,
    "createdAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    evaluado boolean DEFAULT false NOT NULL
);


ALTER TABLE public."EscapareteSession" OWNER TO ico;

--
-- Name: ItemRubrica; Type: TABLE; Schema: public; Owner: ico
--

CREATE TABLE public."ItemRubrica" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    value integer NOT NULL,
    nivel text NOT NULL,
    justification text NOT NULL,
    "escaparametroSessionId" uuid NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "rubricaId" text
);


ALTER TABLE public."ItemRubrica" OWNER TO ico;

--
-- Name: Test; Type: TABLE; Schema: public; Owner: ico
--

CREATE TABLE public."Test" (
    id uuid NOT NULL,
    name text NOT NULL,
    age integer,
    firma boolean DEFAULT false NOT NULL,
    fecha date NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Test" OWNER TO ico;

--
-- Name: User; Type: TABLE; Schema: public; Owner: ico
--

CREATE TABLE public."User" (
    username text NOT NULL,
    email text NOT NULL,
    grupos text NOT NULL,
    given_name text DEFAULT 'Nombre'::text,
    avatar text DEFAULT 'noavatar.png'::text NOT NULL,
    nickname text DEFAULT 'Sin alias'::text NOT NULL,
    familiafp text DEFAULT 'Sin familia'::text,
    ciclofp text DEFAULT 'Sin ciclo'::text,
    curso text DEFAULT 'Sin curso'::text,
    "finPerfil" boolean DEFAULT false NOT NULL,
    pretest boolean DEFAULT false NOT NULL,
    posttest boolean DEFAULT false NOT NULL,
    token_pretest text DEFAULT ''::text NOT NULL,
    token_posttest text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO ico;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: ico
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO ico;

--
-- Name: Actividad id; Type: DEFAULT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."Actividad" ALTER COLUMN id SET DEFAULT nextval('public."Actividad_id_seq"'::regclass);


--
-- Data for Name: Actividad; Type: TABLE DATA; Schema: public; Owner: ico
--

COPY public."Actividad" (id, code, nombre, maxpoints, token, points, username, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EscapareteSession; Type: TABLE DATA; Schema: public; Owner: ico
--

COPY public."EscapareteSession" (id, equipo, "casoId", descripcion, "imagenPath", "createdAt", "updatedAt", evaluado) FROM stdin;
bcae346d-5c78-47e1-81f6-dcdcc0bdc86f	test	navidad	asd	/uploads/escaparates/escaparate-1791616633586-517abc1e-escaparate_juguetes.png	2026-10-10 07:17:14	2026-10-10 07:17:14	t
\.


--
-- Data for Name: ItemRubrica; Type: TABLE DATA; Schema: public; Owner: ico
--

COPY public."ItemRubrica" (id, name, description, value, nivel, justification, "escaparametroSessionId", "updatedAt", "createdAt", "rubricaId") FROM stdin;
cmv22cw2x00005a9s8ii5k6p0	Coherencia conceptual y adecuación al texto descriptivo	¿Se alinea la composición visual del escaparate con la temática, valores de marca o narrativa explicada en el texto descriptivo?	2	Refleja parcialmente el concepto descrito, pero faltan elementos clave o el mensaje resulta confuso para el transeúnte	El escaparate muestra una mezcla de productos (juguetes, ropa infantil, accesorios) que sugieren una tienda de regalos o moda infantil, pero la memoria descriptiva ('asd') es inexistente. Por tanto, no se puede evaluar la coherencia con un texto específico. Sin embargo, visualmente hay cierta temática navideña (luces, adornos colgantes), lo que podría alinearse parcialmente con el caso 'Campaña de Navidad'. La falta de claridad en el mensaje y la mezcla de categorías sin una narrativa fuerte dificultan una puntuación más alta.	bcae346d-5c78-47e1-81f6-dcdcc0bdc86f	2026-10-10 07:19:15.561	2026-10-10 07:19:15.561	coherencia_concepto
cmv22cw2x00015a9sx4y936dj	Composición espacial, equilibrio y punto focal	¿Aplica principios de escaparatismo como líneas de fuga, distribución de pesos, ritmo, jerarquía visual y un punto focal bien definido?	2	Estructura básica visible (simetría simple o pirámide), pero con saturación o desequilibrio en pesos y alturas	El escaparate presenta una distribución densa de elementos, sin un punto focal claro. Aunque hay cierta organización por niveles (productos en estanterías, colgantes arriba), la acumulación de objetos crea saturación visual. No se observa un equilibrio óptimo entre zonas vacías y llenas, lo que dificulta la lectura del escaparate desde la calle.	bcae346d-5c78-47e1-81f6-dcdcc0bdc86f	2026-10-10 07:19:15.561	2026-10-10 07:19:15.561	composicion_visual
cmv22cw2x00025a9s56a913ml	Iluminación, paleta cromática y atmósfera	¿El esquema de color y el tratamiento de la luz (focal, ambiental, sombras, reflejos) realzan el producto y generan el clima deseado?	2	Iluminación general aceptable aunque sin direccionalidad estratégica; combinación de colores correcta pero poco expresiva	La iluminación es funcional pero no destaca los productos ni crea atmósfera. Los reflejos en el cristal y la luz ambiental son suficientes para ver los detalles, pero no hay un diseño lumínico que resalte texturas o genere calidez. La paleta de colores es variada (tonos cálidos de madera, luces amarillas, accesorios coloridos), pero sin una armonía cromática intencional que refuerce la identidad de marca.	bcae346d-5c78-47e1-81f6-dcdcc0bdc86f	2026-10-10 07:19:15.561	2026-10-10 07:19:15.561	iluminacion_color
cmv22cw2x00035a9s4yytrvar	Protagonismo del producto, cartelería y capacidad de atracción	¿El producto es el protagonista indiscutible, la cartelería/precios están bien integrados y el conjunto invita a detenerse y entrar a la tienda?	2	El producto se identifica pero carece de realce comercial; cartelería legible aunque integrada de forma básica	Los productos son visibles y variados, pero ninguno tiene un protagonismo claro. No hay precios ni llamadas a la acción destacadas en el escaparate. La tipografía del nombre de la tienda ('mom kids shop') está presente pero no se integra con los productos para guiar la compra. El conjunto invita a entrar por curiosidad, pero no por una estrategia comercial clara.	bcae346d-5c78-47e1-81f6-dcdcc0bdc86f	2026-10-10 07:19:15.561	2026-10-10 07:19:15.561	producto_llamada_accion
\.


--
-- Data for Name: Test; Type: TABLE DATA; Schema: public; Owner: ico
--

COPY public."Test" (id, name, age, firma, fecha, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: ico
--

COPY public."User" (username, email, grupos, given_name, avatar, nickname, familiafp, ciclofp, curso, "finPerfil", pretest, posttest, token_pretest, token_posttest, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: ico
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c9973338-f2c5-404a-902b-0bc2f52870cc	486cf20ae71df8dc5a64d270240ec686d4525e2c2341d9d7ebf6375f8b364e19	2026-10-09 16:21:34.164442+00	20261009142519_init_escaparametro	\N	\N	2026-10-09 16:21:34.132226+00	1
835d56ed-3c49-4cf0-a38d-5c219373d9c4	4fda0f000348c70808b8b50062722eddc5d38e29adcb9afb6f413845198c11af	2026-10-09 16:21:34.17356+00	20261009143901_remove_evaluajson_add_evaluado	\N	\N	2026-10-09 16:21:34.167283+00	1
\.


--
-- Name: Actividad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ico
--

SELECT pg_catalog.setval('public."Actividad_id_seq"', 1, false);


--
-- Name: Actividad Actividad_pkey; Type: CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."Actividad"
    ADD CONSTRAINT "Actividad_pkey" PRIMARY KEY (id);


--
-- Name: EscapareteSession EscapareteSession_pkey; Type: CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."EscapareteSession"
    ADD CONSTRAINT "EscapareteSession_pkey" PRIMARY KEY (id);


--
-- Name: ItemRubrica ItemRubrica_pkey; Type: CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."ItemRubrica"
    ADD CONSTRAINT "ItemRubrica_pkey" PRIMARY KEY (id);


--
-- Name: Test Test_pkey; Type: CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."Test"
    ADD CONSTRAINT "Test_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (username);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Actividad_token_key; Type: INDEX; Schema: public; Owner: ico
--

CREATE UNIQUE INDEX "Actividad_token_key" ON public."Actividad" USING btree (token);


--
-- Name: ItemRubrica_escaparametroSessionId_idx; Type: INDEX; Schema: public; Owner: ico
--

CREATE INDEX "ItemRubrica_escaparametroSessionId_idx" ON public."ItemRubrica" USING btree ("escaparametroSessionId");


--
-- Name: Test_name_key; Type: INDEX; Schema: public; Owner: ico
--

CREATE UNIQUE INDEX "Test_name_key" ON public."Test" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: ico
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_nickname_key; Type: INDEX; Schema: public; Owner: ico
--

CREATE UNIQUE INDEX "User_nickname_key" ON public."User" USING btree (nickname);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: ico
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Actividad Actividad_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."Actividad"
    ADD CONSTRAINT "Actividad_username_fkey" FOREIGN KEY (username) REFERENCES public."User"(username) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItemRubrica ItemRubrica_escaparametroSessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ico
--

ALTER TABLE ONLY public."ItemRubrica"
    ADD CONSTRAINT "ItemRubrica_escaparametroSessionId_fkey" FOREIGN KEY ("escaparametroSessionId") REFERENCES public."EscapareteSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict eF7rYnl5QYxHfgNgBU1IcGkf4bqY4IPKRqu9BUaztfXNZadifOVst9ZUxYav9wb

