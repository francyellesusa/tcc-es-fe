var url_api = 'http://francyellesusa.000webhostapp.com/be/api/aluno/login/';

//funções disparadas no carregamento da pagina
$(document).ready(function() {
    validarForm();
});

//valida dados no front end
function validarForm() {
    $('#form_login').validate({
        rules: 
        {
          inputEmail:
          {
              required: true,
              email:true
          },

          inputPassword:
          {
            required:true
        }
    },
    errorPlacement: function(error, element) {
        error.insertAfter(element);
    },
    highlight: function(element) {
        $(element).closest('.form-group').after('<span class="form-control-feedback"><i class="material-icons">done</i></span>');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});


// valida se os campos estão preenchidos para habilitar ou desablitar o botão "ENVIAR"
var email = $("#inputEmail").val();
var senha = $("#inputPassword").val();
if (email != '' && senha != '') {
   $("#submit").prop('disabled', false);
}else{
   $("#submit").prop('disabled', true);
} 
}

// action do formulario
function submitForm(dados) {
   var statusRetorno = {true:"Sucesso", false:"Erro"}; 
   var statusClass = {true:"panel-success", false:"panel-danger"}; 

   var email = $("#inputEmail").val();
   var senha = $("#inputPassword").val();
    senha = md5(senha); //criptografa senha no front end

    // envia requisição ao web service
    $.ajax({
        url: url_api,
        type: 'post',
        dataType: 'json',
        data: {email: email, senha: senha},
        async: false
    })
    .done(function(result) {
        // //verifica se os dados do usuário são válidos
        if (result['status'] == true) {
            //caso os dados sejam válidos envia a requisição de autenticação ao web service
            cpf = result['cpf'];
            $.ajax({
                url: url_api+cpf,
                type: 'get',
                dataType: 'json',
            })
            .done(function(result) { //exibe o retorno da requisição para o usuário
                $("#status_retorno").html(statusRetorno[result['status']]);
                $("#mensagem_retorno").html(result['message']);
                $("#content").addClass(statusClass[result['status']])
                $("#modalRetorno").modal();
            })
            .fail(function() { //retorna mensagem de erro
                $("#status_retorno").html(statusRetorno[result['status']]);
                $("#mensagem_retorno").html(result['message']);
                $("#content").addClass(statusClass[result['status']])
                $("#modalRetorno").modal();
            });
            
        }else{
            //se os dados forem inválidos retorna mensagem de erro
            $("#status_retorno").html(statusRetorno[result['status']]);
            $("#mensagem_retorno").html(result['message']);
            $("#content").addClass(statusClass[result['status']])
            $("#modalRetorno").modal();
        }
    })
    .fail(function() { //retorna mensagem de erro
        $("#status_retorno").html(statusRetorno[result['status']]);
        $("#mensagem_retorno").html(result['message']);
        $("#content").addClass(statusClass[result['status']])
        $("#modalRetorno").modal();
    });
}