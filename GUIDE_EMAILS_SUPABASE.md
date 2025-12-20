# Guide Configuration Emails Automatiques Supabase

Ce guide explique comment configurer les emails automatiques dans Supabase pour l'inscription, la confirmation, etc.

## 📧 Configuration SMTP (Déjà fait ✅)

Vous avez déjà configuré SMTP dans Supabase. Maintenant, il faut configurer les templates d'email et les redirections.

---

## 🔧 Étape 1 : Configurer les Templates d'Email dans Supabase

### 1.1 Accéder aux Templates

1. Allez dans votre projet Supabase
2. Cliquez sur **Authentication** dans le menu de gauche
3. Cliquez sur **Email Templates**

### 1.2 Configurer le Template de Confirmation d'Email

1. Sélectionnez **"Confirm signup"** dans la liste
2. Vous verrez le template par défaut
3. Personnalisez-le si vous le souhaitez (optionnel)
4. **IMPORTANT** : Vérifiez que le lien de confirmation est présent :
   ```
   {{ .ConfirmationURL }}
   ```

### 1.3 Configurer le Template de Réinitialisation de Mot de Passe

1. Sélectionnez **"Reset password"**
2. Vérifiez que le lien est présent :
   ```
   {{ .ConfirmationURL }}
   ```

### 1.4 Configurer le Template de Changement d'Email

1. Sélectionnez **"Change email address"**
2. Vérifiez que le lien est présent

---

## 🔗 Étape 2 : Configurer les URLs de Redirection

### 2.1 Configuration dans Supabase Dashboard

1. Allez dans **Authentication** → **URL Configuration**
2. Configurez les URLs suivantes :

#### Site URL (pour le développement)
```
http://localhost:9002
```

#### Redirect URLs (ajoutez toutes ces URLs)
```
http://localhost:9002/**
http://localhost:9002/account
http://localhost:9002/verify-email
http://localhost:9002/reset-password
```

#### Pour la production, ajoutez aussi :
```
https://votre-domaine.com/**
https://votre-domaine.com/account
https://votre-domaine.com/verify-email
https://votre-domaine.com/reset-password
```

### 2.2 Configuration dans le Code

Le code doit utiliser `emailRedirectTo` lors de l'inscription. Vérifiez que c'est bien configuré dans `RegisterPageClient.tsx`.

---

## ✅ Étape 3 : Vérifier que le Code Envoie les Emails

### 3.1 Vérifier l'Inscription

Le code dans `RegisterPageClient.tsx` doit utiliser `supabase.auth.signUp()` avec les options correctes.

### 3.2 Vérifier la Réinitialisation de Mot de Passe

Le code dans `forgot-password/page.tsx` doit utiliser `supabase.auth.resetPasswordForEmail()`.

---

## 🧪 Étape 4 : Tester

### 4.1 Tester l'Inscription

1. Allez sur `/register`
2. Créez un compte
3. Vérifiez votre boîte email
4. Vous devriez recevoir un email de confirmation
5. Cliquez sur le lien dans l'email
6. Vous serez redirigé vers votre site avec le token de confirmation

### 4.2 Tester la Réinitialisation de Mot de Passe

1. Allez sur `/forgot-password`
2. Entrez votre email
3. Vérifiez votre boîte email
4. Cliquez sur le lien de réinitialisation

---

## 🔍 Vérification dans Supabase

### Voir les Emails Envoyés

1. Allez dans **Authentication** → **Users**
2. Cliquez sur un utilisateur
3. Vous verrez l'historique des emails envoyés

### Voir les Logs

1. Allez dans **Logs** → **Auth Logs**
2. Vous verrez tous les événements d'authentification

---

## ⚙️ Configuration Avancée

### Désactiver la Confirmation d'Email (Développement uniquement)

⚠️ **Ne faites cela QUE pour le développement !**

1. Allez dans **Authentication** → **Settings**
2. Désactivez **"Enable email confirmations"**
3. Les utilisateurs pourront se connecter sans confirmer leur email

### Personnaliser les Templates

Vous pouvez personnaliser les templates avec :
- HTML personnalisé
- Variables : `{{ .ConfirmationURL }}`, `{{ .Email }}`, etc.
- Styles CSS inline

---

## 🐛 Dépannage

### Les emails ne partent pas

1. **Vérifiez SMTP** : Allez dans **Settings** → **Auth** → Vérifiez la configuration SMTP
2. **Vérifiez les logs** : Allez dans **Logs** → **Auth Logs** pour voir les erreurs
3. **Vérifiez les spams** : Regardez dans votre dossier spam
4. **Testez SMTP** : Utilisez l'option "Send test email" dans Supabase

### Le lien de confirmation ne fonctionne pas

1. **Vérifiez les Redirect URLs** : Assurez-vous que l'URL est dans la liste
2. **Vérifiez le template** : Le template doit contenir `{{ .ConfirmationURL }}`
3. **Vérifiez le code** : Le code doit gérer la redirection correctement

### L'utilisateur ne reçoit pas l'email

1. **Vérifiez l'adresse email** : Est-elle correcte ?
2. **Vérifiez les spams** : Regardez dans le dossier spam
3. **Vérifiez les logs SMTP** : Y a-t-il des erreurs ?
4. **Testez avec un autre email** : Essayez avec Gmail, Outlook, etc.

---

## 📝 Exemple de Template Personnalisé

### Template de Confirmation d'Email

```html
<h2>Bienvenue sur EZCENTIALS !</h2>
<p>Merci de vous être inscrit. Veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
<p>Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur :</p>
<p>{{ .ConfirmationURL }}</p>
<p>Ce lien expire dans 24 heures.</p>
```

---

## 🎯 Checklist

- [ ] SMTP configuré dans Supabase
- [ ] Templates d'email configurés
- [ ] URLs de redirection configurées
- [ ] Code d'inscription utilise `signUp()` avec `emailRedirectTo`
- [ ] Test d'inscription réussi
- [ ] Email reçu et lien fonctionnel
- [ ] Redirection après confirmation fonctionne

---

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Documentation SMTP](https://supabase.com/docs/guides/auth/auth-smtp)



































