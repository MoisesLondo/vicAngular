import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CvService } from '../cv.service';
import { Map, tileLayer, marker, icon } from 'leaflet';

@Component({
  selector: 'app-curriculum-generator',
  templateUrl: './curriculum-generator.component.html',
  imports: [CommonModule, ReactiveFormsModule], // Import necessary modules
  standalone: true,
  styleUrls: ['./curriculum-generator.component.css']
})
export class CurriculumGeneratorComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  cvForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  cvPreview: string = '';
  showSuccessMessage: boolean = false;
  map: Map | null = null;
  selectedLocation: string = '';
  clickCounter: number = 0;

  constructor(private fb: FormBuilder, private cvService: CvService) {}

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initForm() {
    this.cvForm = this.fb.group({
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      cedula: ["", Validators.required],
      telefono: ["", Validators.required],
      correo: ["", [Validators.required, Validators.email]],
      sitioWeb: [""],
      ubicacion: ["", Validators.required],
      experiencias: this.fb.array([]),
      formaciones: this.fb.array([]),
      competencias: this.fb.array([]),
      habilidades: this.fb.array([]),
      idiomas: this.fb.array([]),
    });

    this.addField("experiencias");
    this.addField("formaciones");
    this.addField("competencias");
    this.addField("habilidades");
  }

  get experiencias() {
    return this.cvForm.get("experiencias") as FormArray;
  }

  get formaciones() {
    return this.cvForm.get("formaciones") as FormArray;
  }

  get competencias() {
    return this.cvForm.get("competencias") as FormArray;
  }

  get habilidades() {
    return this.cvForm.get("habilidades") as FormArray;
  }

  get idiomas() {
    return this.cvForm.get("idiomas") as FormArray;
  }

  addField(fieldName: string) {
    const field = this.createField(fieldName);
    (this.cvForm.get(fieldName) as FormArray).push(field);
  }

  createField(fieldName: string): FormGroup {
    switch (fieldName) {
      case "experiencias":
        return this.fb.group({
          puesto: ["", Validators.required],
          empresa: ["", Validators.required],
          fechaInicio: ["", Validators.required],
          fechaFin: [""],
          descripcion: ["", Validators.required],
        });
      case "formaciones":
        return this.fb.group({
          titulo: ["", Validators.required],
          institucion: ["", Validators.required],
          fechaInicio: ["", Validators.required],
          fechaFin: [""],
        });
      case "competencias":
      case "habilidades":
        return this.fb.group({
          nombre: ["", Validators.required],
          nivel: [0, Validators.required],
        });
      default:
        return this.fb.group({});
    }
  }

  deleteField(fieldName: string, index: number) {
    (this.cvForm.get(fieldName) as FormArray).removeAt(index);
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.cvForm.valid) {
      this.cvService.generatePDF(this.cvForm.value, this.imagePreview as string);
    }
  }

  printCV() {
    this.cvService.printCV(this.cvPreview);
  }

  sendCV() {
    // Aquí iría la lógica para enviar el CV
    this.showSuccessMessage = true;
    setTimeout(() => (this.showSuccessMessage = false), 3000);
  }

  initMap() {
    this.map = new Map(this.mapContainer.nativeElement).setView([51.505, -0.09], 13);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e) => {
      this.clickCounter++;
      this.updateLocationInfo(e.latlng.lat, e.latlng.lng);
    });
  }

  updateLocationInfo(lat: number, lng: number) {
    // Aquí iría la lógica para obtener la información de la ubicación
    // Por ahora, solo actualizaremos las coordenadas
    this.selectedLocation = `Latitud: ${lat}, Longitud: ${lng}`;
    this.cvForm.patchValue({ ubicacion: this.selectedLocation });
  }

  saveLocation() {
    if (this.map) {
      this.map.remove();
    }
    this.mapContainer.nativeElement.style.display = 'none';
  }

  showMap() {
    this.mapContainer.nativeElement.style.display = 'block';
    if (!this.map) {
      this.initMap();
    }
  }
}