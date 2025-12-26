<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../vendor/setasign/fpdf/fpdf.php';

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="boleto.pdf"');

$pdf = new FPDF('P','mm','A4');
$pdf->AddPage();


function drawBarcode($pdf, $code, $x, $y) {
    $barWidth  = 0.8;    
    $barHeight = 20;      
    $numbers = str_split($code);

    foreach ($numbers as $i => $num) {
        if ($i % 2 == 0) { 
            $pdf->Rect($x + $i * $barWidth, $y, $barWidth, $barHeight, 'F');
        }
    }
}

$pdf->SetFont('Arial','B',12);
$pdf->Cell(30,10,'Banco Itaú S.A.',0,0);

$pdf->SetFont('Arial','B',14);
$pdf->Cell(150,10,'341-7',0,1,'R');

$pdf->Ln(4);
$pdf->Line(10, 30, 200, 30);

$pdf->SetFont('Arial','',9);

$pdf->SetXY(10,32);
$pdf->Cell(95,6,'Local de pagamento',1);
$pdf->Cell(95,6,'Vencimento',1,1);

$pdf->Cell(95,8,'Pagar em qualquer banco até o vencimento',1);
$pdf->Cell(95,8,'30/11/2025',1,1);

$pdf->Cell(95,6,'Cedente',1);
$pdf->Cell(95,6,'Agência/Código cedente',1,1);

$pdf->Cell(95,8,'Fulano da Silva',1);
$pdf->Cell(95,8,'1234 / 98765-0',1,1);

$pdf->Cell(190,6,'Linha Digitável',1,1);
$linha_digitavel = '34191.79001 01043.510047 91020.150008 9 99999999999999';
$pdf->Cell(190,8,$linha_digitavel,1,1);

$pdf->Ln(4);
$pdf->SetFont('Arial','B',10);
$pdf->Cell(0,6,'Informações do Documento',0,1);

$pdf->SetFont('Arial','',9);
$pdf->Cell(38,6,'Data Documento',1);
$pdf->Cell(38,6,'Número Documento',1);
$pdf->Cell(38,6,'Espécie',1);
$pdf->Cell(38,6,'Aceite',1);
$pdf->Cell(38,6,'Data Processamento',1,1);

$pdf->Cell(38,8,'29/11/2025',1);
$pdf->Cell(38,8,'000123',1);
$pdf->Cell(38,8,'DM',1);
$pdf->Cell(38,8,'N',1);
$pdf->Cell(38,8,'29/11/2025',1,1);

$pdf->Cell(38,6,'Uso do Banco',1);
$pdf->Cell(38,6,'Carteira',1);
$pdf->Cell(38,6,'Moeda',1);
$pdf->Cell(38,6,'Quantidade',1);
$pdf->Cell(38,6,'Valor Documento',1,1);

$pdf->Cell(38,8,'',1);
$pdf->Cell(38,8,'109',1);
$pdf->Cell(38,8,'R$',1);
$pdf->Cell(38,8,'1',1);
$pdf->Cell(38,8,'49,90',1,1);


$pdf->Ln(2);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,6,'Instruções / Texto de responsabilidade do cedente',0,1);

$pdf->SetFont('Arial','',8);
$pdf->MultiCell(190,5,
"APÓS O VENCIMENTO PAGAR MULTA DE 2% + JUROS DE 1% AO MÊS.\n".
"EM CASO DE DÚVIDAS ENTRE EM CONTATO COM O CEDENTE.\n".
"Este boleto é fictício e usado apenas para fins acadêmicos."
,1);

$pdf->Ln(2);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,6,'Sacado:',0,1);

$pdf->SetFont('Arial','',9);
$pdf->Cell(0,6,'A DE S P ANDRADE',0,1);
$pdf->Cell(0,6,'AV SENADOR SALGADO FILHO',0,1);
$pdf->Cell(0,6,'NATAL - RN - BRA',0,1);


$pdf->Ln(10);
$pdf->SetFont('Arial','',10);
$pdf->Cell(0,6,' ',0,1);

$codigo_barras = preg_replace('/\D/','',$linha_digitavel);
drawBarcode($pdf, $codigo_barras, 10, $pdf->GetY());

$pdf->Ln(25);
$pdf->SetFont('Arial','I',8);
$pdf->Cell(0,6,'* Boleto fictício apenas para TCC. Não possui valor legal.',0,1,'C');

$pdf->Output();
?>
