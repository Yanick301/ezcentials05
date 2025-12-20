# ⚡ Configuration Emails Automatiques - Guide Rapide

## ✅ Ce qui est déjà fait dans le code

Le code est déjà configuré pour envoyer automatiquement les emails ! Voici ce qui se passe :

1. **Inscription** : Quand quelqu'un s'inscrit, Supabase envoie automatiquement un email de confirmation
2. **Réinitialisation de mot de passe** : Un email est envoyé automatiquement
3. **Renvoyer l'email** : L'utilisateur peut demander un nouvel email de confirmation

---

## 🔧 Configuration dans Supabase Dashboard

### Étape 1 : Activer les Emails de Confirmation

1. Allez dans votre projet Supabase
2. Cliquez sur **Authentication** → **Settings**
3. Vérifiez que **"Enable email confirmations"** est activé ✅
4. Si ce n'est pas le cas, activez-le

### Étape 2 : Configurer les URLs de Redirection

1. Toujours dans **Authentication** → **URL Configuration**
2. Configurez :

#### Site URL
```
http://localhost:9002
```
(Pour la production, mettez votre domaine : `https://votre-domaine.com`)

#### Redirect URLs
Ajoutez ces URLs (une par ligne) :
```
http://localhost:9002/**
http://localhost:9002/auth/callback
http://localhost:9002/account
http://localhost:9002/verify-email
http://localhost:9002/reset-password
```

Pour la production, ajoutez aussi :
```
https://votre-domaine.com/**
https://votre-domaine.com/auth/callback
https://votre-domaine.com/account
https://votre-domaine.com/verify-email
https://votre-domaine.com/reset-password
```

### Étape 3 : Personnaliser les Templates d'Email (Optionnel)

1. Allez dans **Authentication** → **Email Templates**
2. Sélectionnez **"Confirm signup"**
3. Vous pouvez personnaliser le template HTML
4. **IMPORTANT** : Assurez-vous que le lien de confirmation est présent :
   ```
   {{ .ConfirmationURL }}
   ```

Exemple de template personnalisé :
```html
<h2>Bienvenue sur EZCENTIALS !</h2>
<p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour confirmer votre email :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
<p>Si le lien ne fonctionne pas, copiez cette URL :</p>
<p>{{ .ConfirmationURL }}</p>
```

---

## 🧪 Tester

### Test 1 : Inscription

1. Allez sur `/register`
2. Créez un compte avec votre vraie adresse email
3. Vérifiez votre boîte email (et le dossier spam)
4. Vous devriez recevoir un email avec un lien de confirmation
5. Cliquez sur le lien
6. Vous serez redirigé vers `/account` et votre email sera confirmé ✅

### Test 2 : Réinitialisation de Mot de Passe

1. Allez sur `/forgot-password`
2. Entrez votre email
3. Vérifiez votre boîte email
4. Cliquez sur le lien de réinitialisation
5. Vous serez redirigé vers la page de réinitialisation

---

## 🔍 Vérifier que ça fonctionne

### Dans Supabase Dashboard

1. **Authentication** → **Users**
   - Vous verrez tous les utilisateurs
   - Le statut "Email confirmed" indique si l'email est vérifié

2. **Logs** → **Auth Logs**
   - Vous verrez tous les événements d'authentification
   - Vous verrez si les emails ont été envoyés

### Dans votre Application

1. Après inscription, l'utilisateur est redirigé vers `/verify-email`
2. Un message indique qu'un email a été envoyé
3. Quand l'utilisateur clique sur le lien dans l'email, il est redirigé vers `/account`
4. L'email est automatiquement confirmé

---

## 🐛 Dépannage

### Les emails ne partent pas

1. **Vérifiez SMTP** :
   - Allez dans **Settings** → **Auth**
   - Vérifiez que SMTP est bien configuré
   - Testez avec "Send test email"

2. **Vérifiez les logs** :
   - Allez dans **Logs** → **Auth Logs**
   - Cherchez les erreurs

3. **Vérifiez les spams** :
   - Regardez dans votre dossier spam
   - Vérifiez que l'email de l'expéditeur n'est pas bloqué

### Le lien de confirmation ne fonctionne pas

1. **Vérifiez les Redirect URLs** :
   - Assurez-vous que `http://localhost:9002/auth/callback` est dans la liste
   - Pour la production, ajoutez votre domaine

2. **Vérifiez le template** :
   - Le template doit contenir `{{ .ConfirmationURL }}`

3. **Vérifiez la page callback** :
   - La page `/auth/callback` doit exister (elle est créée dans le code)

### L'utilisateur ne reçoit pas l'email

1. **Vérifiez l'adresse email** : Est-elle correcte ?
2. **Vérifiez les spams** : Regardez dans le dossier spam
3. **Testez avec un autre email** : Essayez avec Gmail, Outlook, etc.
4. **Vérifiez les logs SMTP** : Y a-t-il des erreurs dans les logs ?

---

## 📋 Checklist

- [ ] SMTP configuré dans Supabase
- [ ] "Enable email confirmations" activé
- [ ] Site URL configuré (`http://localhost:9002`)
- [ ] Redirect URLs configurées (incluant `/auth/callback`)
- [ ] Template d'email vérifié (contient `{{ .ConfirmationURL }}`)
- [ ] Test d'inscription réussi
- [ ] Email reçu
- [ ] Lien de confirmation fonctionne
- [ ] Redirection vers `/account` fonctionne

---

## 🎯 Comment ça marche

1. **Utilisateur s'inscrit** → Code appelle `supabase.auth.signUp()`
2. **Supabase envoie l'email** → Automatiquement via SMTP configuré
3. **Utilisateur clique sur le lien** → Redirigé vers `/auth/callback?code=xxx`
4. **Page callback échange le code** → Pour une session valide
5. **Redirection** → Vers `/account` (ou la page demandée)
6. **Email confirmé** → L'utilisateur peut maintenant se connecter

---

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Documentation SMTP](https://supabase.com/docs/guides/auth/auth-smtp)



































