import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../types';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.scss'], // Note: corrected from styleUrl to styleUrls
})
export class EditPopupComponent implements OnChanges {
  constructor(private formBuilder: FormBuilder) {}

  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  @Input() header!: string;

  @Input() product: Product = {
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  @Output() confirm = new EventEmitter<Product>();

  imagePreview: string | null = null; // To hold the preview of the selected image

  specialCharacterValidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        control.value
      );

      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  productForm = this.formBuilder.group({
    name: ['', [Validators.required, this.specialCharacterValidator()]],
    image: [''], // Will be updated with the file
    price: ['', [Validators.required]],
    rating: [0],
  });

  ngOnChanges(changes: SimpleChanges) {
    // Access product using bracket notation
    if (changes['product'] && changes['product'].currentValue) {
      this.productForm.patchValue(changes['product'].currentValue);
      this.imagePreview = changes['product'].currentValue.image || null; // Set preview from existing product image if any
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string; // Store the image URL for preview
        this.productForm.patchValue({ image: this.imagePreview }); // Store the image URL in the form
      };
      reader.readAsDataURL(input.files[0]); // Read the file as a Data URL
    }
  }

  onConfirm() {
    if (this.productForm.valid) {
      const { name, image, price, rating } = this.productForm.value;

      this.confirm.emit({
        name: name || '',
        image: image || '',
        price: price || '',
        rating: rating || 0,
      });

      this.resetForm(); // Reset the form and preview after confirmation
      this.display = false;
      this.displayChange.emit(this.display);
    }
  }

  onCancel() {
    this.resetForm(); // Reset the form and preview on cancel
    this.display = false;
    this.displayChange.emit(this.display);
  }

  // Helper method to reset the form and preview
  private resetForm() {
    this.productForm.reset({
      name: '',
      image: '',
      price: '',
      rating: 0,
    });
    this.imagePreview = null; // Clear the image preview
  }
}
