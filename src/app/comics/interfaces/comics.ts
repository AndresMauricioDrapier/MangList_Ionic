export interface Comic {
    id?: number;
    _id?: string;
    title: string;
    main_picture: {
        medium: string;
        large: string;
    };
    alternative_titles?: { en: string; ja: string };
    start_date?: string;
    end_date?: string;
    synopsis?: string;
    mean?: number;
    rank?: number;
    popularity?: number;
    num_list_users?: number;
    num_scoring_users?: number;
    nsfw?: string;
    genres?: {id: number, name: string}[];
    created_at?: string;
    updated_at?: string;
    media_type?: string;
    status?: string;
    num_volumes?: number;
    num_chapters?: number;
    authors?: [node: { first_name: string; id: number; last_name: string }];
    pictures?: [{medium: string, large: string}];
    background?: string;
    recommendations?: [
        {
            node: {
                id: number;
                main_picture: { medium: string; large: string };
                title: string;
            };
            num_recommendations: number;
        }
    ];
    serialization?: [node: { id: number; name: string }];
    // my_list_status?: {
    //     type: Object;
    //     required: false;
    // };
    related_anime?: [string];
    related_manga?: [string];
}
export interface Ranking {
    rank: number;
}

export interface ComicyRanking {
    node: Comic;
    ranking?: Ranking;
}
