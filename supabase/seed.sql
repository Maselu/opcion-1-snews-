-- 1. CONFIGURACIÓN PREVIA: Limpiar datos anteriores (Opcional, cuidado en producción)
TRUNCATE TABLE likes, comments, topics, weather_reports, articles, users RESTART IDENTITY CASCADE;

-- 2. INSERTAR USUARIOS EN AUTH (Hack para seeding)
-- Necesitamos insertar en auth.users para que la FK de public.users funcione.
-- Las contraseñas aquí son dummies y no funcionarán para login real, pero sirven para mostrar datos.
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@forum.com', '$2a$10$dummyhashformockingdataonly12345', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '', '', '', ''),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria.garcia@test.com', '$2a$10$dummyhashformockingdataonly12345', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '', '', '', ''),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'juan.perez@test.com', '$2a$10$dummyhashformockingdataonly12345', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- 3. INSERTAR EN PUBLIC.USERS (Perfiles públicos)
INSERT INTO public.users (id, name, email, avatar_url, bio)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin@forum.com', 'https://i.pravatar.cc/150?u=a0eebc99', 'Administrador del sistema y moderador de contenido.'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'María García', 'maria.garcia@test.com', 'https://i.pravatar.cc/150?u=b0eebc99', 'Periodista tecnológica y entusiasta del café.'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Juan Pérez', 'juan.perez@test.com', 'https://i.pravatar.cc/150?u=c0eebc99', 'Fotógrafo aficionado y viajero frecuente.');

-- 4. INSERTAR ARTÍCULOS
-- Asumiendo que las categorías IDs son 1=News, 2=Sports, 3=Weather, 4=Entertainment (según tu esquema)
INSERT INTO articles (category_id, title, content, source, published_at)
VALUES
  (1, 'Avances significativos en Energías Renovables', 'España alcanza un nuevo récord en producción de energía solar durante el último trimestre. Los expertos aseguran que la tendencia continuará al alza gracias a las nuevas inversiones en infraestructura en el sur de la península...', 'El País', NOW() - INTERVAL '2 days'),
  (2, 'La Liga: Un final de temporada de infarto', 'A falta de tres jornadas, tres equipos se disputan el liderazgo en una de las temporadas más reñidas de la última década. El partido del domingo será decisivo para definir al campeón de invierno...', 'Marca', NOW() - INTERVAL '5 hours'),
  (1, 'Nueva IA revoluciona el desarrollo de software', 'Una nueva herramienta basada en transformadores promete reducir el tiempo de codificación en un 40%. Los desarrolladores debaten sobre las implicaciones éticas y laborales de esta nueva tecnología disruptiva...', 'TechCrunch', NOW() - INTERVAL '1 day'),
  (4, 'Estreno mundial de la secuela más esperada', 'Cines de todo el mundo reportan entradas agotadas para el estreno de este fin de semana. La crítica ha sido mixta, pero la audiencia parece estar encantada con los efectos visuales...', 'Variety', NOW() - INTERVAL '1 week');

-- 5. INSERTAR TEMAS (TOPICS) - Foros de discusión creados por usuarios
INSERT INTO topics (user_id, title, description, created_at)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '¿Cuál es el mejor lenguaje para backend en 2025?', 'Estoy dudando entre profundizar en Laravel o pasarme completamente a Node.js/NestJS. ¿Opiniones?', NOW() - INTERVAL '3 days'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Recomendaciones de viaje para Japón', 'Planeo ir en primavera. Busco recomendaciones fuera de las rutas turísticas habituales.', NOW() - INTERVAL '10 hours');

-- 6. INSERTAR COMENTARIOS (Jerárquicos)
-- Comentarios en Artículos
INSERT INTO comments (user_id, article_id, content, created_at)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 1, 'Excelente noticia para el sector energético.', NOW() - INTERVAL '1 day'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 1, 'Aún falta mucho por hacer en cuanto al almacenamiento de esta energía.', NOW() - INTERVAL '20 hours');

-- Comentarios en Temas (Topics)
INSERT INTO comments (user_id, topic_id, content, created_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Laravel con Octane es increíblemente rápido hoy en día. No lo descartaría.', NOW() - INTERVAL '2 days');

-- Respuestas a comentarios (Threaded comments)
-- Asumimos que los IDs generados arriba son 1, 2, 3 respectivamente.
INSERT INTO comments (user_id, article_id, parent_comment_id, content, created_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 2, 'Exacto, las baterías de estado sólido serán clave en la próxima década.', NOW() - INTERVAL '19 hours');

-- 7. INSERTAR LIKES
INSERT INTO likes (user_id, comment_id)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 3), -- María le da like al admin
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 1); -- Juan le da like al comentario de María

-- 8. INSERTAR REPORTES DEL CLIMA (Simulando AEMET/API externa)
INSERT INTO weather_reports (location, data, fetched_at)
VALUES
  ('Madrid', '{"temp_c": 22, "condition": "Sunny", "humidity": 40, "wind_kph": 15}', NOW()),
  ('Barcelona', '{"temp_c": 24, "condition": "Partly Cloudy", "humidity": 65, "wind_kph": 10}', NOW()),
  ('Sevilla', '{"temp_c": 30, "condition": "Clear", "humidity": 30, "wind_kph": 5}', NOW());