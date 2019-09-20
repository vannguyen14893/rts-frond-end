$(document).ready(function(){
  $('#modal-reject-request').on('hidden.bs.modal', function () {
    $('#rejectReason').val('');
  });
  $('#modal-change-target').on('hidden.bs.modal', function() {
    $('#newTarget').val('');
  });
});