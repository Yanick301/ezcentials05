# ⚡ Configuration Rapide Supabase - 5 Minutes

## 🎯 Objectif
Connecter votre projet à Supabase en 5 minutes

---

## 📝 Étape 1 : Créer un compte Supabase (2 min)

1. Allez sur **https://supabase.com**
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub (le plus simple)

---

## 🏗️ Étape 2 : Créer un projet (1 min)

1. Cliquez sur **"New Project"**
2. Remplissez :
   - **Name** : `ezcentials`
   - **Password** : Créez un mot de passe (⚠️ notez-le)
   - **Region** : `West Europe` (ou la plus proche)
   - **Plan** : `Free`
3. Cliquez **"Create new project"**
4. ⏳ Attendez 2 minutes

---

## 🔑 Étape 3 : Récupérer les clés (30 sec)

1. Dans votre projet Supabase → **Settings** (⚙️)
2. Cliquez **API**
3. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (commence par `eyJ...`)

---

## 💾 Étape 4 : Configurer la base de données (1 min)

### A. Créer les tables

1. Dans Supabase → **SQL Editor**
2. Cliquez **"New query"**
3. Ouvrez le fichier `supabase/schema.sql` de votre projet
4. **Copiez TOUT** le contenu
5. **Collez** dans l'éditeur SQL
6. Cliquez **"Run"** (ou `Ctrl+Enter`)
7. ✅ Vous devriez voir "Success"

### B. Configurer les permissions

1. Dans l'éditeur SQL, créez une **nouvelle requête**
2. Ouvrez le fichier `supabase/rls.sql`
3. **Copiez TOUT** le contenu
4. **Collez** dans l'éditeur SQL
5. Cliquez **"Run"**
6. ✅ Vous devriez voir "Success"

---

## ⚙️ Étape 5 : Configurer les variables (30 sec)

1. Dans votre projet, créez/modifiez `.env.local` à la racine
2. Ajoutez ces lignes (remplacez par VOS valeurs) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

**Exemple :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.exemple
```

---

## ✅ Étape 6 : Tester (30 sec)

1. Redémarrez votre serveur :
```bash
npm run dev
```

2. Testez la connexion :
```bash
node scripts/test-supabase-connection.js
```

3. Si tout est OK, vous verrez :
```
✅ Connexion réussie !
✅ Les tables existent
✅ Les permissions sont correctes
🎉 Votre configuration Supabase est correcte !
```

---

## 🎉 C'est fait !

Votre projet est maintenant connecté à Supabase !

### Testez dans l'application :

1. Allez sur `http://localhost:9002/register`
2. Créez un compte
3. Vérifiez dans Supabase → **Table Editor** → `user_profiles`
4. Vous devriez voir votre utilisateur ! 🎊

---

## 🆘 Problèmes ?

### Erreur "Missing Supabase environment variables"
→ Vérifiez que `.env.local` existe et contient les bonnes variables
→ Redémarrez le serveur (`npm run dev`)

### Erreur "relation does not exist"
→ Vous n'avez pas exécuté `schema.sql`
→ Retournez à l'Étape 4A

### Erreur "permission denied"
→ Vous n'avez pas exécuté `rls.sql`
→ Retournez à l'Étape 4B

---

## 📚 Guide détaillé

Pour plus de détails, consultez `GUIDE_CONFIGURATION_SUPABASE.md`







































