import { Pipe, PipeTransform } from "@angular/core";
import { ComicyRanking, Ranking } from "../interfaces/comics";
import { Comic } from "../interfaces/comics";

@Pipe({
    name: "comicsFilterCategory",
    standalone: true,
})
export class ComicsFilterCategoryPipe implements PipeTransform {

    transform(comics: ComicyRanking[], genres?: string,status?:string,year?:string,order?:string): ComicyRanking[] {

      if(genres || status || year|| order){
      const yearSplit=year?.split("-");
      if(yearSplit)
      {
        for(let i=+yearSplit[0], y=1;i < +yearSplit[1];i++,y++){
          yearSplit.push(yearSplit[0]+1);
        }
      }
      //Filtrar por los comics segun lo que se reciba
      const comicsFiltrados = comics.filter((comicRanking: ComicyRanking) => {
        const comic: Comic = comicRanking.node;
        const ranking: Ranking | undefined = comicRanking.ranking;
        return (!genres || comic.genres?.some(genero=>genero.name===genres)) && (!status || comic.status === status) &&
          (!year || comic.start_date?.includes(yearSplit?yearSplit[0]+"":"")) && ranking;
      });

      if(order)
      {
        comicsFiltrados.sort((comicA:ComicyRanking,comicB:ComicyRanking)=>{
          let a:any,b:any;
          if(order==="means"){
            a=comicA.node.mean;
            b=comicB.node.mean;
          }else if(order==="alphabetically"){
            b=comicA.node.title;
            a=comicB.node.title;
          }else if(order==="startDate"){
            a=comicA.node.start_date;
            b=comicB.node.start_date;
          }else if(order==="status"){
            a=comicA.node.mean;
            b=comicB.node.mean;
          }
          return a<b?1:a>b?-1:0;
        })
      }
      return comicsFiltrados;
     }
     else{
      const limitedComics = comics.slice(0,50);
      return limitedComics;
     }


    }
}
