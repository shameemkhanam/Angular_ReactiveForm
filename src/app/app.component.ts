import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Angular_ReactiveForms';
  reactiveForm: FormGroup;
  formStatus;

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      persDetails: new FormGroup({
        firstname: new FormControl(null, [
          Validators.required,
          this.noSpaceAllowed,
        ]), //null, default value
        lastname: new FormControl(null, [
          Validators.required,
          this.noSpaceAllowed,
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email], //2nd arg is sync validators array
          this.emailNotAllowed  //3rd arg is async validator
        ),
      }),
      gender: new FormControl('male'),
      country: new FormControl('india'),
      hobbies: new FormControl(null),
      skills: new FormArray([
        new FormControl(null, Validators.required),
        // new FormControl(null),
        // new FormControl(null)
      ]),
    });

    //valueChanges event on single prop firstname:
    // this.reactiveForm.get('persDetails.firstname').valueChanges.subscribe((value) => {
    //   console.log(value);
    // });

    //valueChanges can be applied on formGroup also:
    // this.reactiveForm.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });
    
    //statusChanges event on formGroup:
    this.reactiveForm.statusChanges.subscribe((value) => {
      console.log(value);  
      this.formStatus = value;
    });

    //setValue() method:v can also take a button or setTimeout..here v should include all fields
    //even if v r not specifying value for them, but in patchValue(), v can specify only those
    //fields for which v want to give value..
    // setTimeout(() => {
    //   this.reactiveForm.setValue({
    //     persDetails: {
    //       firstname: '',
    //       lastname: '',
    //       email: 'abc@example.com',
    //     },
    //     gender: '',
    //     country: '',
    //     hobbies: '',
    //     skills: [],
    //   });
    // }, 3000);

    //patchValue():
    setTimeout(() => {
      this.reactiveForm.patchValue({
        persDetails: {          
          email: 'abc@example.com'
        }        
      });
    }, 3000);  
    
  }

  onSubmit() {
    //no need of template ref var on form elem to access it, v already hv our form in reactiveForm property
    console.log(this.reactiveForm);
    // this.reactiveForm.reset();

    // after reset if v want to set some values for some fields:
    this.reactiveForm.reset({
      persDetails: {
          firstname: '',
          lastname: '',
          email: 'abc@example.com',
        },
        gender: 'male',
        country: 'india',
        hobbies: '',
        skills: [],
    });

  }

  addSkills() {
    (<FormArray>this.reactiveForm.get('skills')).push(new FormControl(null, Validators.required));
  }

  noSpaceAllowed(control: FormControl) {
    if (control.value != null && control.value.indexOf(' ') != -1) {
      return { noSpaceAllowed: true };
    }
    return null;
  }

  emailNotAllowed(control: FormControl): Promise<any> | Observable <any> {
    const response = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'procademy@gmail.com') {
          resolve ({ emailNotAllowed: true });
        }
        else {
          resolve(null);
        }
      }, 5000);
    });
    return response;
  }
}
