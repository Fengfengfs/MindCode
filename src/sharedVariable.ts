import { Subject } from 'rxjs'


export let myVariable = {
    data: [],
}
export let path: string

export const $subject = new Subject()


export const changeMyVariable = (obj) => {
    myVariable = obj
}

export const changePath = (string: string) => {
    path = string
}

