export default class LevelScore {

    constructor(initialScore = 0){
        this.score = initialScore;
    }

    alterScore(points){
        if (isNaN(points)){
            throw new Error("Solo se puede alterar el puntaje con números.");
        }
        this.score += points;
    }

    getCurrentScore(){
        return this.score;
    }
}