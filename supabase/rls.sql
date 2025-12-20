-- Row Level Security (RLS) Policies pour Supabase
-- Ces politiques remplacent les règles Firestore

-- Activer RLS sur toutes les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES POUR user_profiles
-- ============================================
-- Les utilisateurs peuvent lire et modifier leur propre profil
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- POLITIQUES POUR products
-- ============================================
-- Tout le monde peut lire les produits
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

-- Seuls les admins peuvent modifier les produits (à implémenter selon vos besoins)
-- Pour l'instant, désactivé pour correspondre aux règles Firestore
CREATE POLICY "Authenticated users can write products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- POLITIQUES POUR reviews
-- ============================================
-- Tout le monde peut lire les avis
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

-- Les utilisateurs authentifiés peuvent créer des avis
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier/supprimer leurs propres avis
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLITIQUES POUR orders
-- ============================================
-- Les utilisateurs peuvent créer leurs propres commandes
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent lire leurs propres commandes
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres commandes
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- POLITIQUES POUR receipts
-- ============================================
-- Les utilisateurs authentifiés peuvent créer des reçus
CREATE POLICY "Authenticated users can create receipts"
  ON receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs authentifiés peuvent lire les reçus
CREATE POLICY "Authenticated users can read receipts"
  ON receipts FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- POLITIQUES POUR favorites
-- ============================================
-- Les utilisateurs peuvent gérer leurs propres favoris
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);














































