import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  credentials = {
    email: '', // Peut être email ou téléphone
    motDePasse: ''
  };

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si déjà connecté, rediriger vers le dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    // Réinitialiser le message d'erreur
    this.errorMessage = '';
    
    // Validation
    if (!this.credentials.email || !this.credentials.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Validation et normalisation du téléphone
    let input = this.credentials.email.trim().replace(/\s+/g, ''); // Retirer les espaces
    
    // Normaliser le format : si commence par 7, ajouter +223 (code Mali)
    if (input.match(/^7[0-9]{8}$/)) {
      input = '+223' + input;
    } else if (input.match(/^223[0-9]{8}$/)) {
      input = '+' + input;
    }
    
    if (!this.isValidEmailOrPhone(input)) {
      this.errorMessage = 'Format invalide. Utilisez un numéro de téléphone (ex: +22370123456 ou 70123456)';
      return;
    }

    this.isLoading = true;

    // Le backend attend telephone, on envoie la valeur normalisée
    const loginData = {
      telephone: input, // Le backend utilise telephone comme identifiant
      motDePasse: this.credentials.motDePasse
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          // Vérifier si l'utilisateur est admin ou médecin
          const user = this.authService.getCurrentUser();
          if (user && (user.role === 'ADMINISTRATEUR' || user.role === 'MEDECIN')) {
            // Connexion réussie, rediriger vers le dashboard
            this.router.navigate(['/dashboard']);
          } else {
            // Utilisateur non autorisé
            this.errorMessage = 'Accès non autorisé. Seuls les administrateurs et médecins peuvent accéder à cet espace.';
            this.authService.logout();
          }
        } else {
          // Réponse sans succès
          this.errorMessage = response.message || 'Erreur de connexion';
        }
      },
      error: (error) => {
        this.isLoading = false;
        // Le message d'erreur est déjà formaté par ApiService
        this.errorMessage = error.message || 'Erreur de connexion. Vérifiez vos identifiants.';
        console.error('Erreur de connexion:', error);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private isValidEmailOrPhone(input: string): boolean {
    // Le backend n'accepte que le téléphone comme identifiant
    // Format attendu: +?[0-9]{8,15} (selon le pattern dans Utilisateur.java)
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    
    return phoneRegex.test(input);
  }

  onInputChange() {
    // Effacer le message d'erreur quand l'utilisateur tape
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}

