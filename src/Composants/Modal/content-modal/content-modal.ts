import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../service/modalservice';
import { ConseilService, ConseilRequest } from '../../../service/conseil.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-content-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-modal.html',
  styleUrl: './content-modal.css',
})
export class ContentModal implements OnInit, OnDestroy {
  isOpen = false;
  modalType: 'create' | 'view' | 'edit' = 'create';
  modalData: any = null;

  // Formulaire
  formData: {
    titre: string;
    contenu: string;
    categorie: string;
    cible: string;
    typeContenu: 'article' | 'video';
    videoFile: File | null;
    videoUrl: string;
  } = {
    titre: '',
    contenu: '',
    categorie: 'SANTE_GENERALE',
    cible: 'Femme enceinte',
    typeContenu: 'article',
    videoFile: null,
    videoUrl: ''
  };

  // Options
  categories: SelectOption[] = [
    { value: 'NUTRITION', label: 'Nutrition' },
    { value: 'HYGIENE', label: 'Hygiène' },
    { value: 'ALLAITEMENT', label: 'Allaitement' },
    { value: 'PREVENTION', label: 'Prévention' },
    { value: 'SANTE_GENERALE', label: 'Santé générale' }
  ];

  cibles: SelectOption[] = [
    { value: 'Femme enceinte', label: 'Femme enceinte' },
    { value: 'Jeune mère', label: 'Jeune mère' },
    { value: 'Patiente prénatale', label: 'Patiente prénatale' },
    { value: 'Patiente postnatale', label: 'Patiente postnatale' },
    { value: 'Maman', label: 'Maman' },
    { value: 'Tous', label: 'Tous' }
  ];

  // États
  isSubmitting = false;
  isUploading = false;
  uploadProgress = 0;
  errorMessage = '';
  successMessage = '';

  private subscription?: Subscription;
  @Output() contentCreated = new EventEmitter<void>();

  constructor(
    private modalService: ModalService,
    private conseilService: ConseilService
  ) {}

  ngOnInit() {
    this.subscription = this.modalService.contentModalState$.subscribe(state => {
      this.isOpen = state.type !== 'create' || state.data !== undefined;
      this.modalType = state.type;
      this.modalData = state.data;

      if (this.modalType === 'edit' && this.modalData) {
        this.loadEditData();
      } else if (this.modalType === 'create') {
        this.resetForm();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadEditData() {
    if (this.modalData) {
      // Déterminer le type de contenu
      const isVideo = this.modalData.videoUrl || 
                     (this.modalData.type === 'video') ||
                     (this.modalData.content && this.modalData.content.includes('video'));

      this.formData = {
        titre: this.modalData.title || '',
        contenu: this.modalData.content || '',
        categorie: this.getCategoryFromContent(this.modalData.category || ''),
        cible: this.modalData.targetAudience || 'Femme enceinte',
        typeContenu: isVideo ? 'video' : 'article',
        videoFile: null,
        videoUrl: this.modalData.videoUrl || ''
      };
    }
  }

  getCategoryFromContent(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Nutrition': 'NUTRITION',
      'Santé infantile': 'HYGIENE',
      'Grossesse': 'SANTE_GENERALE',
      'Exercices prénatals': 'SANTE_GENERALE'
    };
    return categoryMap[category] || 'SANTE_GENERALE';
  }

  resetForm() {
    this.formData = {
      titre: '',
      contenu: '',
      categorie: 'SANTE_GENERALE',
      cible: 'Femme enceinte',
      typeContenu: 'article',
      videoFile: null,
      videoUrl: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.uploadProgress = 0;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Vérifier que c'est une vidéo
      if (!file.type.startsWith('video/')) {
        this.errorMessage = 'Veuillez sélectionner un fichier vidéo';
        return;
      }

      // Vérifier la taille (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        this.errorMessage = 'La vidéo ne doit pas dépasser 100MB';
        return;
      }

      this.formData.videoFile = file;
      this.errorMessage = '';
    }
  }

  async uploadVideo(): Promise<string | null> {
    if (!this.formData.videoFile) {
      return null;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';

    try {
      const result = await firstValueFrom(this.conseilService.uploadVideo(this.formData.videoFile));
      this.isUploading = false;
      this.uploadProgress = 100;
      
      if (result && result.fileUrl) {
        // Construire l'URL complète si nécessaire
        const baseUrl = environment.apiUrl.replace('/api', '');
        const fullUrl = result.fileUrl.startsWith('http') 
          ? result.fileUrl 
          : `${baseUrl}${result.fileUrl}`;
        
        return fullUrl;
      }
      return null;
    } catch (error: any) {
      this.isUploading = false;
      this.errorMessage = error.message || 'Erreur lors de l\'upload de la vidéo';
      return null;
    }
  }

  async onSubmit() {
    // Validation
    if (!this.formData.titre.trim()) {
      this.errorMessage = 'Le titre est obligatoire';
      return;
    }

    if (!this.formData.contenu.trim() && this.formData.typeContenu === 'article') {
      this.errorMessage = 'Le contenu est obligatoire pour un article';
      return;
    }

    if (this.formData.typeContenu === 'video' && !this.formData.videoFile && !this.formData.videoUrl) {
      this.errorMessage = 'Veuillez uploader une vidéo ou fournir une URL';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      let lienMedia = '';

      // Si c'est une vidéo, uploader le fichier ou utiliser l'URL
      if (this.formData.typeContenu === 'video') {
        if (this.formData.videoFile) {
          const uploadedUrl = await this.uploadVideo();
          if (!uploadedUrl) {
            this.isSubmitting = false;
            return;
          }
          lienMedia = uploadedUrl;
        } else if (this.formData.videoUrl) {
          lienMedia = this.formData.videoUrl;
        }
      }

      // Créer la requête
      const request: ConseilRequest = {
        titre: this.formData.titre,
        contenu: this.formData.contenu,
        lienMedia: lienMedia,
        categorie: this.formData.categorie,
        cible: this.formData.cible
      };

      if (this.modalType === 'edit' && this.modalData) {
        // Mettre à jour
        const conseilId = parseInt(this.modalData.id);
        await firstValueFrom(this.conseilService.updateConseil(conseilId, request));
        this.successMessage = 'Contenu mis à jour avec succès';
      } else {
        // Créer
        await firstValueFrom(this.conseilService.createConseil(request));
        this.successMessage = 'Contenu créé avec succès';
      }

      // Fermer le modal après un court délai
      setTimeout(() => {
        this.closeModal();
        // Émettre un événement pour recharger la liste
        this.contentCreated.emit();
      }, 1500);

    } catch (error: any) {
      this.errorMessage = error.message || 'Erreur lors de la sauvegarde';
      console.error('Erreur:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal() {
    this.modalService.closeContentModal();
    this.resetForm();
  }

  // Empêcher la fermeture du modal en cliquant sur le backdrop
  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      // Ne pas fermer si on est en train d'uploader ou de soumettre
      if (!this.isSubmitting && !this.isUploading) {
        this.closeModal();
      }
    }
  }
}
