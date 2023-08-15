import { Subject } from 'rxjs';


export let myVariable: any;

export const $subject = new Subject();


export const changeMyVariable = (obj) =>{
    myVariable = obj
}

