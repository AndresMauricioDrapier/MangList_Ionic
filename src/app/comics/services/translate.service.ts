import { Injectable } from "@angular/core";
import axios, { AxiosRequestConfig } from "axios";

@Injectable({
    providedIn: "root",
})
export class TranslateService {
    private apiUrl =
        "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=es";

    translate(text: string) {
        const headers: AxiosRequestConfig["headers"] = {
            "Ocp-Apim-Subscription-Key": "e28744a24b43496bb1d1a250e726db08",
            "Ocp-Apim-Subscription-Region": "westeurope",
            "Content-Type": "application/json",
        };
        const data = [
            {
                text: text,
            },
        ];
        return axios.post(this.apiUrl, data, { headers });
    }
}
