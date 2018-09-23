import Swal from 'sweetalert2'
export default class ErrorHandling {

  publishError(error){
    console.log(error)
    Swal('Oops...', error.message, 'error')
  }

}
