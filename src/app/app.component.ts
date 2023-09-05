import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup; // เริ่มตั้งค่าตรงนี้ได้เลย
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit(): void {
    // เริ่มตั้งค่า Form ตรงนี้ดีกว่าเพราะ life cycle จะถูกเรียกก่อนที่ template จะ render
    this.signupForm = new FormGroup({
      // Form ซ้อน Form
      userData: new FormGroup({
        // การ control กำหนด default
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this), // ส่งเพื่ออ้างอิงยังไม่เรียกใช้ทำงาน และ bind เพื่อให้ this หมายถึง class นี้จะได้เรียกใช้สิ่งที่ต้องการใน class นี้ได้
        ]), //Validate
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmail.bind(this)
        ), // Validate หลายอย่าง
      }),
      gender: new FormControl('female'),
      hobbies: new FormArray([]),
    });
    // ดักฟังการเปลี่ยนแปลงที่ใช้ทั่วไปมีสองอย่าง การเปลี่ยนแปลงค่า value และการเปลี่ยนแปลง status
    this.signupForm.valueChanges.subscribe((value) => console.log(value)); // ดัก input ที่กรอก
    this.signupForm.statusChanges.subscribe((status) => console.log(status)); // สถานะจะเป็น INVALID/PENDING/VALID

    // กำหนดค่า set และ patch
    // set ค่า default ของ form
    this.signupForm.setValue({
      userData: {
        username: 'Max',
        email: 'max@test.com',
      },
      gender: 'male',
      hobbies: [],
    });
    // Update ค่าบางส่วนใน form
    this.signupForm.patchValue({
      userData: {
        username: 'Anna',
      },
    });
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset({ gender: 'female' }); // reset form แต่เราสามารถเลือกได้ว่าจะเว้น input ตัวไหนไม่ให้โดน reset ไปด้วย
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  // การ get controls ทำได้ 2 แบบ
  // getControls() {
  //   return (<FormArray>this.signupForm.get('hobbies')).controls;
  // }

  // use getter
  get controls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  // Custom validate
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      // ถ้าไม่เท่ากับ -1 หมายความว่า เจอชื่อต้องห้ามใน input มันเลยเป็น invalid ต้องส่งค่าออกไปให้ angular รู้ว่า invalid
      return { nameIsForbidden: true };
    }
    // ถ้าเท่ากับ -1 หมายความว่า เป็น valid จะต้องส่ง null ออกไปให้ angular รู้ว่า valid ห้ามส่ง { nameIsForbidden: false }; เด็ดขาด
    return null;
  }

  // Custom validate Asynchronus
  forbiddenEmail(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          return resolve({ emailIsForbidden: true });
        } else {
          return resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
