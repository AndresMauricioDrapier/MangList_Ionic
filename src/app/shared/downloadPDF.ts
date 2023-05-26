import { inject } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Filesystem } from '@capacitor/filesystem';
import { FilesystemDirectory } from "@capacitor/filesystem/dist/esm/definitions";
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export async function enviarPDFyCorreo(payment:any, subscription:any) {
  const { amount, name, mail, methodPayment } = payment;

  const imageContent = await getImageContent(subscription.icon);
  // Definir el contenido del documento PDF
  const documentDefinition:TDocumentDefinitions = {
      content: [
          { text: "FACTURA DE SUSCRIPCIÓN", style: "header" },
          {
              text: `Fecha: ${new Date().toUTCString()}`,
              margin: [0, 0, 0, 10],
          },
          { text: `Nombre: ${name}`, margin: [0, 0, 0, 10] },
          { text: `Correo electrónico: ${mail}`, margin: [0, 0, 0, 10] },
          { text: `Método de pago: ${methodPayment}`, margin: [0, 0, 0, 10] },
          { image: imageContent, width: 100, height: 100 },
          {
              text: "DETALLES DE LA SUSCRIPCIÓN",
              style: "subheader",
              margin: [0, 20, 0, 10],
          },
          {
              table: {
                  body: [
                      [
                          { text: "Producto", style: "tableHeader" },
                          { text: "Precio", style: "tableHeader" },
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
              alignment: "center",
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
              color: "black",
          },
      },
  };
  let pdf = pdfMake.createPdf(documentDefinition);
  downloadPdf(pdf)
}

function downloadPdf(pdf:pdfMake.TCreatedPdf){
  if(inject(Platform).is('cordova')){
    pdf.getBase64(async (data)=>{
      try{
        let path = 'pdf/SubscripcionMangList.pdf';
        const result = await Filesystem.writeFile({
          path:path,
          data,
          directory:FilesystemDirectory.Documents,
          recursive:true
        });
        inject(FileOpener).open(`${result.uri}`,'application/pdf');
      }catch(e){
        console.error('Error al descargar el pdf',e);
      }
    })
  }else{
    pdf.download();
  }
}

async function getImageContent(imageUrl: string): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = await loadImage(imageUrl);

  canvas.width = img.width;
  canvas.height = img.height;
  ctx!.drawImage(img, 0, 0);

  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl;
}

function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
}
