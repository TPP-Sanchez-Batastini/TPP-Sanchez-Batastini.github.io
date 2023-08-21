export default class LevelScore {

    constructor(initialScore = 0){
        this.score = initialScore;
        this.timeStart = new Date();
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

    getCurrentTime(){
        const timeInSeconds = parseInt((new Date() - this.timeStart)/1000);
        const seconds = timeInSeconds%60;
        const minutes = parseInt((timeInSeconds-seconds)/60);
        const minutesUpToSixty = minutes%60;
        const hours = parseInt((minutes-minutesUpToSixty)/24);
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }
}