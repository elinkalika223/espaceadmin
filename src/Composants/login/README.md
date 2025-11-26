# Composant Login

## 📋 Description

Composant d'authentification pour l'espace d'administration KènèyaMuso.

## 🎯 Fonctionnalités

- ✅ Formulaire de connexion avec validation
- ✅ Affichage/masquage du mot de passe
- ✅ Gestion des erreurs avec messages clairs
- ✅ État de chargement pendant la connexion
- ✅ Redirection automatique si déjà connecté
- ✅ Vérification du rôle (ADMINISTRATEUR ou MEDECIN uniquement)
- ✅ Design responsive et accessible

## 🔧 Utilisation

### Route
Le composant est accessible via la route `/login` et est la route par défaut (`/`).

### Authentification
Le composant utilise le service `AuthService` pour gérer l'authentification.

### Champs du formulaire
- **Téléphone**: Format attendu `+223XXXXXXXX`
- **Mot de passe**: Champ sécurisé avec possibilité d'affichage

### Validation
- Les deux champs sont obligatoires
- Validation basique du format téléphone
- Messages d'erreur affichés en cas d'échec

## 🎨 Style

Le composant suit le même style que les autres composants de l'application :
- Utilise les variables CSS globales (`--primary-color`, `--spacing-*`, etc.)
- Design cohérent avec le reste de l'interface
- Animations et transitions fluides

## 🔐 Sécurité

- Le token JWT est stocké dans le localStorage
- Vérification du rôle avant d'autoriser l'accès
- Redirection vers `/login` si non authentifié

## 📱 Responsive

Le composant est entièrement responsive et s'adapte aux écrans mobiles.

## ♿ Accessibilité

- Labels associés aux champs
- Messages d'erreur clairs
- Support du clavier
- Attributs ARIA pour les lecteurs d'écran

