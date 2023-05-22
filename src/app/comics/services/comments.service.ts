import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Commentary } from "../interfaces/comment";
import { CommentResponse, CommentsResponse } from "../interfaces/responses";

@Injectable({
    providedIn: "root",
})
export class CommentsService {
    private readonly COMIC_URL = "comments";
    constructor(private readonly http: HttpClient) {}

    getComments(id: string): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.COMIC_URL}/comic/${id}`);
    }

    getAllComments(): Observable<CommentsResponse> {
        return this.http.get<CommentsResponse>(`${this.COMIC_URL}`);
    }

    addComment(comment: Commentary): Observable<CommentResponse> {
        return this.http.post<CommentResponse>(`${this.COMIC_URL}`, comment);
    }
}
