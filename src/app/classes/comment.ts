export class Comment {
    constructor(
        public productID: string = 'undefined', 
        public userID: string = 'undefined', 
        public username: string = 'undefined', 
        public title: string = 'undefined', 
        public text: string = 'undefined', 
        public grade: number = 0
        ) {
    }
}
