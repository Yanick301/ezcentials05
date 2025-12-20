# 🔗 Configuration des URLs de Production

## Problème résolu ✅

Les liens de confirmation et autres liens venant de Supabase pointaient toujours vers `localhost:9002` au lieu de l'URL de production.

## Solution

Tous les fichiers ont été modifiés pour utiliser la variable d'environnement `NEXT_PUBLIC_SITE_URL` au lieu de `window.location.origin`.

### Fichiers modifiés

1. **`src/app/register/RegisterPageClient.tsx`** - Inscription
2. **`src/app/verify-email/page.tsx`** - Renvoyer l'email de confirmation
3. **`src/app/forgot-password/page.tsx`** - Réinitialisation de mot de passe
4. **`src/components/orders/UploadReceiptForm.tsx`** - Envoi d'emails de commande

## Configuration requise

### 1. Variable d'environnement

Ajoutez dans votre fichier `.env.local` (développement) ou dans les variables d'environnement de votre plateforme de déploiement (production) :

```env
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

**Pour le développement local :**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:9002
```

**Pour la production :**
```env
NEXT_PUBLIC_SITE_URL=https://ezcentials.com
```

### 2. Configuration Supabase

Dans le dashboard Supabase, allez dans **Authentication** → **URL Configuration** :

#### Site URL
```
https://votre-domaine.com
```

#### Redirect URLs
Ajoutez toutes ces URLs (une par ligne) :
```
https://votre-domaine.com/**
https://votre-domaine.com/auth/callback
https://votre-domaine.com/account
https://votre-domaine.com/verify-email
https://votre-domaine.com/reset-password
https://votre-domaine.com/order-status/customer-confirm
https://votre-domaine.com/order-status/customer-reject
```

**Important :** Pour le développement, gardez aussi `http://localhost:9002/**` dans la liste.

## Comment ça fonctionne maintenant

1. **Inscription** : L'email de confirmation utilise `NEXT_PUBLIC_SITE_URL`
2. **Réinitialisation de mot de passe** : Le lien utilise `NEXT_PUBLIC_SITE_URL`
3. **Emails de commande** : Les boutons Confirmer/Rejeter utilisent `NEXT_PUBLIC_SITE_URL`
4. **Renvoyer l'email** : Le lien de confirmation utilise `NEXT_PUBLIC_SITE_URL`

## Fallback

Si `NEXT_PUBLIC_SITE_URL` n'est pas définie, le code utilise `window.location.origin` comme fallback. Cependant, **il est fortement recommandé de définir cette variable** pour la production.

## Vérification

Pour vérifier que tout fonctionne :

1. ✅ Vérifiez que `NEXT_PUBLIC_SITE_URL` est définie dans vos variables d'environnement
2. ✅ Vérifiez que les Redirect URLs sont configurées dans Supabase
3. ✅ Testez l'inscription et vérifiez que l'email contient le bon lien
4. ✅ Testez la réinitialisation de mot de passe
5. ✅ Testez une commande et vérifiez que les boutons dans l'email pointent vers le bon domaine

## Notes importantes

- ⚠️ **Redémarrez le serveur** après avoir modifié les variables d'environnement
- ⚠️ **Rebuild l'application** en production après avoir modifié les variables d'environnement
- ⚠️ Les variables `NEXT_PUBLIC_*` sont accessibles côté client, ne mettez pas d'informations sensibles dedans




















