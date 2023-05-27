import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Payment } from 'src/app/subscriptions/interfaces/payment';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { FilesystemDirectory } from '@capacitor/filesystem';

import { Plugins, } from '@capacitor/core';
const { Filesystem, Browser } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class PdfMakeService {
  constructor(private alertController: AlertController) {}

  async generatePdf(payment: Payment, subscription: any) {
    const { amount, mailUser, name, method } = payment;

    const imageContent = await this.getImageContent(subscription.icon);
    // Definir el contenido del documento PDF
    const documentDefinition: TDocumentDefinitions = {
      content: [
        { text: 'FACTURA DE SUSCRIPCIÓN', style: 'header' },
        {
          text: `Fecha: ${new Date().toUTCString()}`,
          margin: [0, 0, 0, 10],
        },
        { text: `Nombre: ${name}`, margin: [0, 0, 0, 10] },
        { text: `Correo electrónico: ${mailUser}`, margin: [0, 0, 0, 10] },
        { text: `Método de pago: ${method}`, margin: [0, 0, 0, 10] },
        { image: imageContent, width: 100, height: 100 },
        {
          text: 'DETALLES DE LA SUSCRIPCIÓN',
          style: 'subheader',
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            body: [
              [
                { text: 'Producto', style: 'tableHeader' },
                { text: 'Precio', style: 'tableHeader' },
              ],
              [
                { text: subscription.type },
                { text: `${subscription.price} EUR` },
              ],
            ],
          },
          margin: [0, 0, 0, 20],
        },
        { text: `Total: ${amount} EUR`, bold: true },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).getBlob(async (pdfBlob) => {
      const pdfData = new Blob([pdfBlob], { type: 'application/pdf' });
      const fileName = 'factura.pdf';

      try {
        const result = await Filesystem["writeFile"]({
          path: fileName,
          data: pdfData,
          directory: FilesystemDirectory.External,
          recursive: true
        });

        const fileUrl = result.uri;

        await Browser["open"]({ url: fileUrl });

        // Mostrar una alerta después de abrir el archivo
        const alert = await this.alertController.create({
          header: 'PDF abierto',
          message: 'El archivo PDF se ha abierto en el navegador',
          buttons: ['Aceptar'],
        });
        await alert.present();
      } catch (error:any) {
        // Mostrar una alerta en caso de error
        const alert = await this.alertController.create({
          header: 'Error al abrir el PDF',
          message: error.message,
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    });

  }
  async getImageContent(imageUrl: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = await this.loadImage(imageUrl);

    canvas.width = img.width;
    canvas.height = img.height;
    ctx!.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
  }

  loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = imageUrl;
    });
  }
}
