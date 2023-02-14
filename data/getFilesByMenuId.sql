select 
	d.id as menu_id,
	c.kind as menu_name,
	c.pid as document_id, 
	c.title as document_title,
	c.id as file_id,
	c.name as file_name
from 
	boardtree d 
join 
	(
		select 
			b.id as id,
			b.name as name,
			a.id as pid,
			a.kind as kind,
			a.title as title
		from 
			gboard a 
		join 
			attaches b 
		on 
			b.pid=a.id
		where 
			a.useYn='Y' and b.useYn='Y' and b.realYn='Y'
	) c
on
	d.id=c.kind
where
	d.id=?;