import { Injectable } from "@angular/core"
import jsPDF from "jspdf"
import "jspdf-autotable"

@Injectable({
  providedIn: "root",
})
export class CvService {
  generatePDF(formData: any, imageBase64: string) {
    const doc = new jsPDF()

    // Añadir imagen si existe
    if (imageBase64) {
      doc.addImage(imageBase64, "JPEG", 10, 10, 50, 50)
    }

    // Información personal
    doc.setFontSize(22)
    doc.text(`${formData.nombre} ${formData.apellido}`, 70, 20)
    doc.setFontSize(12)
    doc.text(`Email: ${formData.correo}`, 70, 30)
    doc.text(`Teléfono: ${formData.telefono}`, 70, 35)
    doc.text(`Ubicación: ${formData.ubicacion}`, 70, 40)
    if (formData.sitioWeb) {
      doc.text(`Sitio Web: ${formData.sitioWeb}`, 70, 45)
    }

    // Experiencia laboral
    doc.setFontSize(16)
    doc.text("Experiencia Laboral", 10, 70)
    const experienceData = formData.experiencias.map((exp: any) => [
      exp.puesto,
      exp.empresa,
      `${exp.fechaInicio} - ${exp.fechaFin || "Presente"}`,
      exp.descripcion,
    ])
    ;(doc as any).autoTable({
      startY: 75,
      head: [["Puesto", "Empresa", "Período", "Descripción"]],
      body: experienceData,
    })

    // Formación académica
    const currentY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(16)
    doc.text("Formación Académica", 10, currentY)
    const educationData = formData.formaciones.map((edu: any) => [
      edu.titulo,
      edu.institucion,
      `${edu.fechaInicio} - ${edu.fechaFin || "Presente"}`,
    ])
    ;(doc as any).autoTable({
      startY: currentY + 5,
      head: [["Título", "Institución", "Período"]],
      body: educationData,
    })

    // Competencias y Habilidades
    const skillsY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(16)
    doc.text("Competencias y Habilidades", 10, skillsY)
    const skillsData = [
      ...formData.competencias.map((comp: any) => [comp.nombre, `Nivel: ${comp.nivel}/5`]),
      ...formData.habilidades.map((hab: any) => [hab.nombre, `Nivel: ${hab.nivel}/5`]),
    ]
    ;(doc as any).autoTable({
      startY: skillsY + 5,
      head: [["Competencia/Habilidad", "Nivel"]],
      body: skillsData,
    })

    // Guardar el PDF
    doc.save("curriculum.pdf")
  }

  printCV(cvPreview: string) {
    // Implement the print logic here
    console.log('Printing CV:', cvPreview);
  }
}

