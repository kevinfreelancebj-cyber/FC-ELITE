-- ============================================================
-- 002_virtual_pros.sql
-- Phase 1 : Migration pour la création d'Identité
-- Fusionner la logique des Joueurs dans les Profils Utilisateurs
-- ============================================================

-- Ajout des champs d'identité virtuelle (Virtual Pro) dans les profils
ALTER TABLE profiles
ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN position TEXT,
ADD COLUMN secondary_position TEXT,
ADD COLUMN height INTEGER CHECK (height >= 150 AND height <= 220), -- cm
ADD COLUMN weight INTEGER CHECK (weight >= 50 AND weight <= 120),  -- kg
ADD COLUMN strong_foot TEXT CHECK (strong_foot IN ('Droit', 'Gauche', 'Ambidextre')),
ADD COLUMN bio TEXT;

-- Mettre à jour les politiques de sécurité (RLS)
-- Les utilisateurs peuvent mettre à jour n'importe quel champ de leur profil,
-- y compris les nouveaux champs. La politique existante permet déjà l'UPDATE complet:
-- CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Pour l'instant, on laisse la table `players` (IA) intacte pour la rétrocompatibilité 
-- de la page Accueil/Mercato jusqu'à ce que nous la remplacions complètement 
-- par des requêtes sur les vrais utilisateurs (profiles).
