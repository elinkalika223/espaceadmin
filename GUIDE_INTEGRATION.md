# 🚀 Guide d'Intégration Rapide - Espace Admin

## 📋 Résumé

Ce guide vous accompagne dans l'intégration de l'espace admin avec le backend KeneyaMusoBackend.

## ✅ Ce qui a été préparé

### 1. **Fichiers de configuration**
- ✅ `src/environments/environment.ts` - Configuration développement
- ✅ `src/environments/environment.prod.ts` - Configuration production
- ✅ `src/app/app.config.ts` - HttpClient configuré

### 2. **Services de base**
- ✅ `src/service/api.service.ts` - Service HTTP générique
- ✅ `src/service/auth.service.ts` - Service d'authentification

### 3. **Documentation**
- ✅ `ANALYSE_INTEGRATION.md` - Analyse complète du projet

## 🎯 Prochaines étapes

### Étape 1: Tester la connexion au backend

1. **Démarrer le backend:**
   ```bash
   cd KeneyaMusoBackend
   ./mvnw spring-boot:run
   # ou
   java -jar target/keneya-muso-backend.jar
   ```

2. **Vérifier que le backend répond:**
   ```bash
   curl http://localhost:8080/api/auth/login
   ```

3. **Démarrer le frontend:**
   ```bash
   cd espaceadmin
   npm start
   ```

### Étape 2: Créer une page de login

Créez `src/Composants/login/login.ts` et `login.html` pour tester l'authentification.

### Étape 3: Intégrer module par module

Suivez l'ordre recommandé dans `ANALYSE_INTEGRATION.md`:
1. Dashboard (lecture seule)
2. Patients (CRUD)
3. Professionals (CRUD)
4. Content (CRUD)

## 📝 Exemple d'utilisation

### Utiliser ApiService

```typescript
import { ApiService } from '../service/api.service';

constructor(private apiService: ApiService) {}

// GET request
this.apiService.get<any>('/patientes').subscribe(data => {
  console.log(data);
});

// POST request
this.apiService.post('/auth/login', {
  telephone: '+22370123456',
  motDePasse: 'password123'
}).subscribe(response => {
  console.log(response);
});
```

### Utiliser AuthService

```typescript
import { AuthService } from '../service/auth.service';

constructor(private authService: AuthService) {}

// Connexion
this.authService.login({
  telephone: '+22370123456',
  motDePasse: 'password123'
}).subscribe({
  next: (response) => {
    console.log('Connecté:', response);
    // Rediriger vers le dashboard
  },
  error: (error) => {
    console.error('Erreur:', error);
  }
});

// Vérifier l'authentification
if (this.authService.isAuthenticated()) {
  const user = this.authService.getCurrentUser();
  console.log('Utilisateur:', user);
}
```

## 🔧 Configuration

### Modifier l'URL du backend

Éditez `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // Changez selon vos besoins
  // ...
};
```

## ⚠️ Points importants

1. **CORS:** Assurez-vous que le backend autorise les requêtes depuis `http://localhost:4200`
2. **Token JWT:** Le token est automatiquement ajouté aux requêtes via `ApiService`
3. **Format des données:** Vérifiez le mapping entre frontend et backend (voir `ANALYSE_INTEGRATION.md`)

## 📚 Documentation complète

Consultez `ANALYSE_INTEGRATION.md` pour:
- Architecture détaillée
- Mapping des données
- Liste complète des endpoints
- Plan d'action détaillé

## 🆘 Dépannage

### Erreur CORS
- Vérifiez la configuration CORS dans le backend Spring Boot
- Ajoutez `@CrossOrigin(origins = "http://localhost:4200")` aux controllers

### Token non envoyé
- Vérifiez que le token est stocké: `localStorage.getItem('auth_token')`
- Vérifiez que `ApiService.getHeaders()` inclut le token

### Erreur 401 (Unauthorized)
- Vérifiez que le token est valide
- Vérifiez que le token n'a pas expiré
- Reconnectez-vous si nécessaire

## 📞 Support

Pour toute question, consultez:
- `ANALYSE_INTEGRATION.md` - Documentation complète
- `KeneyaMusoBackend/API_EXAMPLES.md` - Exemples d'API
- `KeneyaMusoBackend/ARCHITECTURE.md` - Architecture backend

---

**Bon développement ! 🚀**

