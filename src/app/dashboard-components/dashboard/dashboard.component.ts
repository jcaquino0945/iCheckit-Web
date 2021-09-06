import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  taskScope: any = ['1ITA','1ITB','1ITC','1ITD','1ITE','1ITF','1ITH','2ITA','2ITB','2ITC','2ITD','2ITE','2ITF','3ITA','3ITB','3ITC','3ITD','3ITF','3ITG','3ITF','3ITG','4ITA','4ITB','4ITC','4ITD','4ITE','BS Information Technology', 'BS Information Systems', 'BS Computer Science'];
  taskScopeArray!: string[];
  p: number = 1;
  email!:string;
  password!:string;
  name!:string;
  number!:string;
  userData:any;
  fsData: any;
  addTaskModal!: boolean;
  dateToday = Date.now();
  verifyTasks$: any;
  addTaskForm!:any;
 
  constructor(
    public auth: AuthService,
    readonly fire: AngularFireAuth, 
    public router: Router,
    public taskService: TaskService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.fire.user.subscribe((user:any) => {
      this.userData = user;
      this.auth.getUserData(user?.uid).subscribe(res => {
        this.fsData = res;
      })
    })
    this.taskService.getVerifyTasks().subscribe((res) => {
      this.verifyTasks$ = res;
      console.log(this.verifyTasks$);
    })

    this.taskScopeArray = [];

    this.addTaskForm = this.fb.group({
      title: ['', Validators.required,],
      description: ['', Validators.required],
      scope: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  public triggerAddTaskModal() {
    this.addTaskModal = !this.addTaskModal;
  }

  changeTaskScope(e:any) {
    console.log(e.target.value);
    console.log(typeof e.target.value);
    if (this.taskScopeArray.includes(e.target.value)) {
      console.log('already included')
    } else if (!this.taskScopeArray.includes(e.target.value)) {
      this.taskScopeArray.push(e.target.value)
      console.log(this.taskScopeArray);
    }
    // this.createStudentForm.controls.section.setValue(e.target.value, {
    //   onlySelf: true
    // });
  }

  addTask() {
    if (this.addTaskForm.valid) {
      this.taskService.addTask(
        this.addTaskForm.controls['title'].value,
        this.addTaskForm.controls['description'].value,
        this.taskScopeArray,
        new Date(this.addTaskForm.controls['deadline'].value
      ))
      console.log(this.addTaskForm.value);
      console.log(typeof this.addTaskForm.controls['deadline'].value)
    }
    else if (this.addTaskForm.invalid) {
      this.addTaskForm.controls['title'].markAsTouched();
      this.addTaskForm.controls['description'].markAsTouched();
      this.addTaskForm.controls['scope'].markAsTouched();
      this.addTaskForm.controls['deadline'].markAsTouched();
      console.log('invalid');
      console.log(this.addTaskForm.value);
      console.log(new Date(this.addTaskForm.controls['deadline'].value))
      
      console.log(typeof new Date(this.addTaskForm.controls['deadline'].value))

    }
  }

}
