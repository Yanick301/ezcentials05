# 📧 Guide Configuration Templates Email Supabase

Ce guide explique comment configurer les templates d'email dans Supabase pour que les emails de réinitialisation de mot de passe contiennent bien les liens.

---

## ⚠️ Problème Actuel

Les emails de réinitialisation de mot de passe envoyés par Supabase ne contiennent pas de liens cliquables.

---

## ✅ Solution : Configurer les Templates d'Email dans Supabase

### Étape 1 : Accéder aux Templates d'Email

1. Connectez-vous à votre projet Supabase
2. Allez dans **Authentication** dans le menu de gauche
3. Cliquez sur **Email Templates**

### Étape 2 : Configurer le Template "Reset password"

1. Dans la liste des templates, sélectionnez **"Reset password"**
2. Vous verrez le template par défaut
3. **IMPORTANT** : Vérifiez que le template contient la variable `{{ .ConfirmationURL }}`

#### Template Recommandé (avec lien cliquable)

**Subject (Sujet)** :
```
Réinitialiser votre mot de passe - EZCENTIALS
```

**Body (Corps)** :
```html
<h2>Réinitialisation de votre mot de passe</h2>
<p>Bonjour,</p>
<p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte EZCENTIALS.</p>
<p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a></p>
<p>Ou copiez et collez ce lien dans votre navigateur :</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>
<p><strong>Ce lien est valide pendant 1 heure.</strong></p>
<p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
<p>L'équipe EZCENTIALS</p>
```

### Étape 3 : Configurer le Template "Confirm signup" (Optionnel mais recommandé)

**Subject** :
```
Confirmez votre email - EZCENTIALS
```

**Body** :
```html
<h2>Bienvenue sur EZCENTIALS !</h2>
<p>Bonjour,</p>
<p>Merci de vous être inscrit sur EZCENTIALS.</p>
<p>Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirmer mon email</a></p>
<p>Ou copiez et collez ce lien dans votre navigateur :</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>
<p>L'équipe EZCENTIALS</p>
```

### Étape 4 : Configurer le Template "Change email address" (Optionnel)

**Subject** :
```
Confirmez votre nouvelle adresse email - EZCENTIALS
```

**Body** :
```html
<h2>Changement d'adresse email</h2>
<p>Bonjour,</p>
<p>Vous avez demandé à changer votre adresse email.</p>
<p>Cliquez sur le lien ci-dessous pour confirmer votre nouvelle adresse email :</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirmer mon email</a></p>
<p>Ou copiez et collez ce lien dans votre navigateur :</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>
<p>L'équipe EZCENTIALS</p>
```

---

## 🔗 Variables Disponibles dans les Templates

Supabase fournit plusieurs variables que vous pouvez utiliser dans vos templates :

- `{{ .ConfirmationURL }}` - **LE PLUS IMPORTANT** : URL de confirmation/réinitialisation avec le token
- `{{ .Email }}` - Adresse email de l'utilisateur
- `{{ .SiteURL }}` - URL de votre site
- `{{ .Token }}` - Token de confirmation (généralement utilisé dans l'URL)
- `{{ .TokenHash }}` - Hash du token
- `{{ .RedirectTo }}` - URL de redirection après confirmation

---

## ✅ Vérification

### Test 1 : Réinitialisation de Mot de Passe

1. Allez sur `/forgot-password`
2. Entrez votre email
3. Vérifiez votre boîte email
4. **Vérifiez que l'email contient un lien cliquable**
5. Cliquez sur le lien
6. Vous devriez être redirigé vers `/reset-password`
7. Définissez votre nouveau mot de passe

### Test 2 : Confirmation d'Email

1. Créez un nouveau compte sur `/register`
2. Vérifiez votre boîte email
3. **Vérifiez que l'email contient un lien cliquable**
4. Cliquez sur le lien
5. Vous devriez être redirigé vers `/account`

---

## 🐛 Dépannage

### Le lien ne s'affiche pas dans l'email

1. **Vérifiez que `{{ .ConfirmationURL }}` est présent** dans le template
2. **Vérifiez les Redirect URLs** dans Authentication → URL Configuration
3. **Vérifiez les logs** dans Logs → Auth Logs pour voir les erreurs

### Le lien ne fonctionne pas

1. **Vérifiez les Redirect URLs** :
   - `http://localhost:9002/auth/callback` (développement)
   - `https://votre-domaine.com/auth/callback` (production)
   - `http://localhost:9002/reset-password` (développement)
   - `https://votre-domaine.com/reset-password` (production)

2. **Vérifiez que la page `/reset-password` existe** (elle a été créée)

3. **Vérifiez que `NEXT_PUBLIC_SITE_URL` est configuré** dans vos variables d'environnement

---

## 📝 Notes Importantes

- **`{{ .ConfirmationURL }}` est OBLIGATOIRE** : Sans cette variable, aucun lien ne sera généré dans l'email
- Les templates supportent le **HTML** : Vous pouvez utiliser des balises HTML pour formater vos emails
- Les **styles inline** sont recommandés : Certains clients email ne supportent pas les styles CSS externes
- Le lien est **valide pendant 1 heure** par défaut (configurable dans Supabase)

---

## 🎨 Personnalisation Avancée

Vous pouvez personnaliser encore plus vos templates avec :

- **Couleurs de votre marque** : Utilisez les couleurs EZCENTIALS (#000 pour le fond, #fff pour le texte)
- **Logo** : Ajoutez une image de votre logo (utilisez une URL absolue)
- **Multilingue** : Créez des templates différents pour chaque langue (si vous utilisez plusieurs projets Supabase)

Exemple avec logo :
```html
<img src="https://votre-domaine.com/images/logo.png" alt="EZCENTIALS" style="max-width: 200px; margin-bottom: 20px;">
```

---

**Une fois les templates configurés, tous les emails contiendront des liens cliquables !** ✅














