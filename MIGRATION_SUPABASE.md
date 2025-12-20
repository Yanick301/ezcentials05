# Guide de Migration Firebase vers Supabase

Ce document décrit la migration complète de Firebase vers Supabase pour le projet EZCentials.

## ✅ État de la Migration

### Fait
- ✅ Installation des dépendances Supabase
- ✅ Création du schéma SQL (tables et triggers)
- ✅ Configuration des clients Supabase (client et serveur)
- ✅ Création du provider Supabase
- ✅ Création des hooks équivalents (useUser, useDoc, useCollection)
- ✅ Migration de l'authentification (login, register, sign out)
- ✅ Migration de la page forgot-password
- ✅ Migration de la page verify-email
- ✅ Migration du composant UserButton
- ✅ Mise à jour de AppProviders

### À Faire
- ⏳ Migration de la page account (upload photo de profil)
- ⏳ Migration des composants utilisant Firestore (products, reviews, orders, favorites)
- ⏳ Migration de Firebase Storage vers Supabase Storage
- ⏳ Configuration des Row Level Security (RLS) dans Supabase
- ⏳ Tests complets de toutes les fonctionnalités
- ⏳ Nettoyage des fichiers Firebase obsolètes

## 📋 Configuration Requise

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### Base de données

1. Créez un projet Supabase sur [supabase.com](https://supabase.com)
2. Exécutez le script SQL dans `supabase/schema.sql` dans l'éditeur SQL de Supabase
3. Exécutez le script RLS dans `supabase/rls.sql` pour configurer les permissions

## 🔄 Changements Principaux

### Authentification

**Avant (Firebase):**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

**Après (Supabase):**
```typescript
import { useSupabase } from '@/supabase';
const { supabase } = useSupabase();
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```

### Base de données

**Avant (Firestore):**
```typescript
import { doc, getDoc } from 'firebase/firestore';
const docRef = doc(firestore, 'collection', 'id');
const docSnap = await getDoc(docRef);
```

**Après (Supabase):**
```typescript
import { useSupabase } from '@/supabase';
const { supabase } = useSupabase();
const { data, error } = await supabase.from('table').select('*').eq('id', 'id').single();
```

### Hooks

Les hooks `useUser`, `useDoc`, et `useCollection` ont été migrés vers Supabase et fonctionnent de la même manière:

```typescript
import { useUser, useDoc, useCollection } from '@/supabase';

// Utilisation identique
const { user, profile } = useUser();
const { data, isLoading, error } = useDoc('user_profiles', userId);
const { data, isLoading, error } = useCollection('products');
```

## 📁 Structure des Fichiers

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts          # Client Supabase pour le navigateur
│       ├── server.ts          # Client Supabase pour le serveur
│       └── database.types.ts  # Types TypeScript pour la base de données
├── supabase/
│   ├── provider.tsx           # Provider React pour Supabase
│   ├── index.ts                # Exports principaux
│   ├── auth/
│   │   └── use-user.tsx        # Hook useUser migré
│   └── firestore/
│       ├── use-doc.tsx         # Hook useDoc migré
│       └── use-collection.tsx  # Hook useCollection migré
└── supabase/
    ├── schema.sql              # Schéma SQL pour les tables
    └── rls.sql                 # Politiques RLS
```

## 🔐 Sécurité (RLS)

Les Row Level Security policies ont été configurées pour correspondre aux règles Firestore:

- **user_profiles**: Les utilisateurs peuvent lire/modifier leur propre profil
- **products**: Lecture publique, écriture pour utilisateurs authentifiés
- **reviews**: Lecture publique, création/modification pour l'auteur
- **orders**: Les utilisateurs peuvent créer/lire/modifier leurs propres commandes
- **receipts**: Création/lecture pour utilisateurs authentifiés
- **favorites**: Gestion complète pour le propriétaire

## 🚀 Prochaines Étapes

1. **Tester l'authentification**: Vérifier que login/register fonctionnent
2. **Migrer les composants Firestore**: 
   - Products
   - Reviews
   - Orders
   - Favorites
3. **Migrer Storage**: Remplacer Firebase Storage par Supabase Storage
4. **Tests complets**: Vérifier toutes les fonctionnalités
5. **Nettoyer**: Supprimer les fichiers Firebase obsolètes

## 📝 Notes Importantes

- Le profil utilisateur est créé automatiquement par un trigger SQL lors de l'inscription
- Les types de données ont été adaptés (Firestore Timestamp → PostgreSQL TIMESTAMPTZ)
- Les arrays Firestore sont maintenant des tableaux PostgreSQL
- Les objets imbriqués Firestore sont maintenant des colonnes JSONB

## 🐛 Dépannage

### Erreur "Missing Supabase environment variables"
Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont définis.

### Erreur de permissions
Vérifiez que les politiques RLS sont correctement configurées dans Supabase.

### Erreur de connexion
Vérifiez que l'URL Supabase est correcte et que le projet est actif.






































