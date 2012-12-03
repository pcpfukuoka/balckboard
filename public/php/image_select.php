<?php
?>
<html>
<head>
	</head>
	<head>


	<body>
		<?php
		//db処理（class_Seqが一致して）
		$sql = ";";

		$result = mysql_query($sql);
		$cnt = mysql_num_rows($result);

		if($cnt == 0)
		{
			echo "画像はありません";
		}
		else
		{
			$row = mysql_fetch_array($result);
			$class_seq = $row['class_seq'];
			//黒板ページに飛ばす
			foreach($row as $value){
		?>
				<img border="0" src="<?= $row['img_url'] ?>" >


			}
		}
		?>
	</body>
</html>
