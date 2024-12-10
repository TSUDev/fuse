import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PersistDataService implements OnInit {

    private cachedDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public cachedData$ = this.cachedDataSubject.asObservable();

    ngOnInit(): void {
        const data = JSON.parse(localStorage.getItem("cachedData") || '{}');
        this.cachedDataSubject.next(data);
    }

    setItem(key: string, item: any) {
        const currentData = this.cachedDataSubject.getValue();
        currentData[key] = item;
        this.cachedDataSubject.next(currentData);
        this.setCachedDataLocalStorage(currentData);
    }

    getItem(key: string) {
        return this.cachedDataSubject.getValue()[key];
    }

    removeItem(key: string) {
        const currentData = this.cachedDataSubject.getValue();
        delete currentData[key];
        this.cachedDataSubject.next(currentData);
        this.setCachedDataLocalStorage(currentData);
    }

    clearItems() {
        const clearedData = {};
        this.cachedDataSubject.next(clearedData);
        this.setCachedDataLocalStorage(clearedData);
    }

    private setCachedDataLocalStorage(data: any) {
        localStorage.setItem("cachedData", JSON.stringify(data));
    }
}





/*
setItem("token",this.token){}
 
cachedData={
    token:"tokenValue"
};
 
getItem("token"){}
 
output: "tokenValue"
*/

/*
this service will be used to store (State object)
when navigating from screen to screen
so that when we leave the screen 
and come back to it 
the data is filled back in form

router.navigateByUrl('', { state: data });

ex:
when we select a product in (warranty-activation-list) component
we are navigated to (product-warranty-activation) which contains 
a form that will be filled with data coming from (warranty-activation-list)

before navigating to it we call =>  setWarrantyListRowItem(){}
to store values of form in it 

lets say we moved to another screen from (product-warranty-activation)
the form data will go away

so in the back button of the screen we are on 

we call getWarrantyListRowItem() {} and send it in State
so the form is filled again with the values
router.navigateByUrl('', { state: getWarrantyListRowItem() });

(
    what handles the state in product-warranty-activation is the ngOnInit
    with the window.state.history
)

*/