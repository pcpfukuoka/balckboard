<?php

	$seq = "";
	$name = "";
	$send =array();
	//データベースの呼出
	require_once("../lib/dbconect.php");
	$dbcon = DbConnect();

	//送られてくるデータ
	$group_seq = $_POST['group_seq'];


	//クラスのgroup_seqとgroup_nameを求めるＳＱＬ
	$sql = "SELECT group_seq, group_name FROM m_group WHERE class_flg = 1";
	$result = mysql_query($sql);

	//縦の席の最大を求めるＳＱＬ
	$sql = "SELECT max(row) as mx FROM seat WHERE group_seq='$group_seq'";
	$res = mysql_query($sql);
	$row = mysql_fetch_array($res);
	$row_max = $row['mx'];

	//横の席の最大を求めるＳＱＬ
	$sql = "SELECT max(col) as mx FROM seat WHERE group_seq ='$group_seq'";
	$res = mysql_query($sql);
	$row = mysql_fetch_array($res);
	$col_max = $row['mx'];

	for($i = 1; $i <= $row_max; $i++)
	{

		for($j = 1; $j <= $col_max; $j++)
		{

			//席に対応したuser_seqを持ってくるＳＱＬ
			$sql = "SELECT user_seq FROM seat
			WHERE group_seq ='$group_seq'
			AND row='$i'and col='$j'";

			$res = mysql_query($sql);
			$row = mysql_fetch_assoc($res);
			$user_seq = $row['user_seq'];

			if($user_seq == "")
			{
				//席が空いているため識別子を配列に格納
				$seq =$seq."null";
				$name =$name."null";
			}
			else
			{
				//user_seqに対応したuser_nameを持ってくるＳＱＬ
				$sql ="SELECT user_name,user_seq FROM m_user WHERE user_seq='$user_seq'";
				$res =mysql_query($sql);
				$row =mysql_fetch_array($res);

				//結果を配列に格納
				$seq =$seq.$row['user_seq'];
				$name =$name.$row['user_name'];
			}
			//一人終わった識別子を挿入
			$seq =$seq."n";
			$name =$name."n";
		}
		//1列が終わったため、識別子を配列に格納
		$seq =$seq."r";
		$name =$name."r";
	}
	//送信するデータを配列に追加
	$send = array('seq'=>$seq,'name'=>$name,'col_max'=>$col_max,'row_max'=>$row_max);

	Dbdissconnect($dbcon);
	$test = json_encode($send);
	echo $test;
?>