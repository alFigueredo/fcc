-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)

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

DROP DATABASE universe;
--
-- Name: universe; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE universe WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE universe OWNER TO freecodecamp;

\connect universe

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: galaxy; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy (
    galaxy_id integer NOT NULL,
    name character varying(50) NOT NULL,
    constellation character varying(50),
    distance_from_earth integer,
    notes text
);


ALTER TABLE public.galaxy OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.galaxy_galaxy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galaxy_galaxy_id_seq OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.galaxy_galaxy_id_seq OWNED BY public.galaxy.galaxy_id;


--
-- Name: moon; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.moon (
    moon_id integer NOT NULL,
    name character varying(50) NOT NULL,
    discovery_year integer,
    mean_radius numeric,
    planet_id integer
);


ALTER TABLE public.moon OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.moon_moon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moon_moon_id_seq OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.moon_moon_id_seq OWNED BY public.moon.moon_id;


--
-- Name: planet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet (
    planet_id integer NOT NULL,
    name character varying(50) NOT NULL,
    has_rings boolean,
    has_life boolean,
    discovery_year character varying(15) NOT NULL,
    star_id integer,
    star_system_id integer
);


ALTER TABLE public.planet OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.planet_planet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planet_planet_id_seq OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.planet_planet_id_seq OWNED BY public.planet.planet_id;


--
-- Name: star; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star (
    star_id integer NOT NULL,
    name character varying(50) NOT NULL,
    distance_from_earth numeric NOT NULL,
    bayer_designation character varying(60),
    galaxy_id integer
);


ALTER TABLE public.star OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_star_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_star_id_seq OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_star_id_seq OWNED BY public.star.star_id;


--
-- Name: star_system; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star_system (
    star_system_id integer NOT NULL,
    name character varying(50) NOT NULL,
    constellation character varying(50)
);


ALTER TABLE public.star_system OWNER TO freecodecamp;

--
-- Name: star_system_star_system_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_system_star_system_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_system_star_system_id_seq OWNER TO freecodecamp;

--
-- Name: star_system_star_system_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_system_star_system_id_seq OWNED BY public.star_system.star_system_id;


--
-- Name: galaxy galaxy_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy ALTER COLUMN galaxy_id SET DEFAULT nextval('public.galaxy_galaxy_id_seq'::regclass);


--
-- Name: moon moon_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon ALTER COLUMN moon_id SET DEFAULT nextval('public.moon_moon_id_seq'::regclass);


--
-- Name: planet planet_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet ALTER COLUMN planet_id SET DEFAULT nextval('public.planet_planet_id_seq'::regclass);


--
-- Name: star star_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star ALTER COLUMN star_id SET DEFAULT nextval('public.star_star_id_seq'::regclass);


--
-- Name: star_system star_system_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star_system ALTER COLUMN star_system_id SET DEFAULT nextval('public.star_system_star_system_id_seq'::regclass);


--
-- Data for Name: galaxy; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy VALUES (1, 'Milky Way', 'Sagittarius', 0, 'This is the galaxy containing the Sun and its Solar System, and therefore Earth. Most things visible to the naked eye in the sky are part of it, including the Milky Way composing the Zone of Avoidance.');
INSERT INTO public.galaxy VALUES (2, 'Large Magellanic Cloud', 'Dorado/Mensa', 160000, 'Visible only from the southern hemisphere. It is also the brightest patch of nebulosity in the sky.');
INSERT INTO public.galaxy VALUES (3, 'Small Magellanic Cloud', 'Tucana', 200000, 'Visible only from the southern hemisphere.');
INSERT INTO public.galaxy VALUES (4, 'Andromeda Galaxy', 'Andromeda', 2500000, 'Once called the Great Andromeda Nebula, it is situated in the Andromeda constellation.');
INSERT INTO public.galaxy VALUES (5, 'Triangulum Galaxy', 'Triangulum', 2900000, 'Being a diffuse object, its visibility is strongly affected by even small amounts of light pollution, ranging from easily visible in direct vision in truly dark skies to a difficult averted vision object in rural/suburban skies.');
INSERT INTO public.galaxy VALUES (6, 'Centaurus A', 'Centaurus', 13700000, 'Centaurus A has been spotted with the naked eye by Stephen James O''Meara.');
INSERT INTO public.galaxy VALUES (7, 'Bode''s Galaxy', 'Ursa Major', 12000000, 'Highly experienced amateur astronomers may be able to see Messier 81 under exceptional observing conditions.');
INSERT INTO public.galaxy VALUES (8, 'Sculptor Galaxy', 'Sculptor', 12000000, 'NGC 253 has been observed with the naked eye by Timo Karhula.');


--
-- Data for Name: moon; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.moon VALUES (1, 'Moon', NULL, 1738, 3);
INSERT INTO public.moon VALUES (2, 'Io', 1610, 1821.6, 5);
INSERT INTO public.moon VALUES (3, 'Europa', 1610, 1560.8, 5);
INSERT INTO public.moon VALUES (4, 'Ganymede', 1610, 2634.1, 5);
INSERT INTO public.moon VALUES (5, 'Callisto', 1610, 2410.3, 5);
INSERT INTO public.moon VALUES (6, 'Titan', 1655, 2574.73, 6);
INSERT INTO public.moon VALUES (7, 'Iapetus', 1671, 735.6, 6);
INSERT INTO public.moon VALUES (8, 'Rhea', 1672, 763.8, 6);
INSERT INTO public.moon VALUES (9, 'Tethys', 1684, 533.1, 6);
INSERT INTO public.moon VALUES (10, 'Dione', 1684, 561.4, 6);
INSERT INTO public.moon VALUES (11, 'Titania', 1787, 788.9, 7);
INSERT INTO public.moon VALUES (12, 'Oberon', 1787, 761.4, 7);
INSERT INTO public.moon VALUES (13, 'Mimas', 1789, 198.2, 6);
INSERT INTO public.moon VALUES (14, 'Enceladus', 1789, 252.1, 6);
INSERT INTO public.moon VALUES (15, 'Triton', 1846, 1353.4, 8);
INSERT INTO public.moon VALUES (16, 'Hyperion', 1848, 135, 6);
INSERT INTO public.moon VALUES (17, 'Ariel', 1851, 578.9, 7);
INSERT INTO public.moon VALUES (18, 'Umbriel', 1851, 584.7, 7);
INSERT INTO public.moon VALUES (19, 'Phobos', 1877, 11.267, 4);
INSERT INTO public.moon VALUES (20, 'Deimos', 1877, 6.2, 4);


--
-- Data for Name: planet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet VALUES (1, 'Mercury', false, false, 'Prehistoric', 1, 1);
INSERT INTO public.planet VALUES (2, 'Venus', false, false, 'Prehistoric', 1, 1);
INSERT INTO public.planet VALUES (3, 'Earth', false, true, 'Prehistoric', 1, 1);
INSERT INTO public.planet VALUES (4, 'Mars', false, false, 'Prehistoric', 1, 1);
INSERT INTO public.planet VALUES (5, 'Jupiter', true, false, 'Prehistoric', 1, 1);
INSERT INTO public.planet VALUES (6, 'Saturn', true, false, 'Prehistoric', 1, 1);
INSERT INTO public.planet VALUES (7, 'Uranus', true, false, '1781', 1, 1);
INSERT INTO public.planet VALUES (8, 'Neptune', true, false, '1846', 1, 1);
INSERT INTO public.planet VALUES (9, 'Gamma Cephei Ab', NULL, NULL, '1988', NULL, 2);
INSERT INTO public.planet VALUES (10, 'PSR B1257+12 c', NULL, NULL, '1992', NULL, 3);
INSERT INTO public.planet VALUES (11, 'PSR B1257+12 d', NULL, NULL, '1992', NULL, 3);
INSERT INTO public.planet VALUES (12, 'PSR B1620-26 b', NULL, NULL, '1993', NULL, 4);


--
-- Data for Name: star; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star VALUES (2, 'Sirius', 8.6, 'alpha Canis Majoris', NULL);
INSERT INTO public.star VALUES (3, 'Canopus', 310, 'alpha Carinae', NULL);
INSERT INTO public.star VALUES (4, 'Rigil Kentaurus and Toliman', 4.4, 'alpha Centauri', NULL);
INSERT INTO public.star VALUES (5, 'Arcturus', 37, 'alpha Bootes', NULL);
INSERT INTO public.star VALUES (6, 'Vega', 25, 'alpha Lyrae', NULL);
INSERT INTO public.star VALUES (1, 'Sun', 0.000016, '', 1);


--
-- Data for Name: star_system; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star_system VALUES (1, 'Solar System', '');
INSERT INTO public.star_system VALUES (2, 'Gamma Cephei', 'Cepheus');
INSERT INTO public.star_system VALUES (3, 'PSR B1257+12', 'Virgo');
INSERT INTO public.star_system VALUES (4, 'PSR B1620-26', 'Scorpius');


--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.galaxy_galaxy_id_seq', 8, true);


--
-- Name: moon_moon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.moon_moon_id_seq', 20, true);


--
-- Name: planet_planet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.planet_planet_id_seq', 41, true);


--
-- Name: star_star_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_star_id_seq', 6, true);


--
-- Name: star_system_star_system_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_system_star_system_id_seq', 4, true);


--
-- Name: galaxy galaxy_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_name_key UNIQUE (name);


--
-- Name: galaxy galaxy_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_pkey PRIMARY KEY (galaxy_id);


--
-- Name: moon moon_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_name_key UNIQUE (name);


--
-- Name: moon moon_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_pkey PRIMARY KEY (moon_id);


--
-- Name: planet planet_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_name_key UNIQUE (name);


--
-- Name: planet planet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_pkey PRIMARY KEY (planet_id);


--
-- Name: star star_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_name_key UNIQUE (name);


--
-- Name: star star_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_pkey PRIMARY KEY (star_id);


--
-- Name: star_system star_system_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star_system
    ADD CONSTRAINT star_system_name_key UNIQUE (name);


--
-- Name: star_system star_system_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star_system
    ADD CONSTRAINT star_system_pkey PRIMARY KEY (star_system_id);


--
-- Name: moon moon_planet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: planet planet_star_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_star_id_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- Name: planet planet_star_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_star_system_id_fkey FOREIGN KEY (star_system_id) REFERENCES public.star_system(star_system_id);


--
-- Name: star star_galaxy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_galaxy_id_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- PostgreSQL database dump complete
--

