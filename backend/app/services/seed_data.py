import uuid
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.models.taxonomy import Subject, Chapter, Topic
from backend.app.models.question import Question, QuestionOption
from backend.app.models.test import Test, TestQuestion
from backend.app.core.security import hash_password

def seed_database_if_empty(db: Session):
    # Check if already seeded
    if db.query(Subject).first():
        return

    print("Seeding database with NEET taxonomy, realistic questions, tests, and demo users...")

    # 1. Users
    student = User(
        id=str(uuid.uuid4()),
        email="student@neetprep.com",
        hashed_password=hash_password("neet123"),
        full_name="Aarav Sharma",
        target_year=2026,
        student_grade="CLASS_12",
        role="STUDENT"
    )
    admin = User(
        id=str(uuid.uuid4()),
        email="admin@neetprep.com",
        hashed_password=hash_password("admin123"),
        full_name="Dr. R. K. Verma (Faculty)",
        target_year=2026,
        student_grade="REPEATER",
        role="ADMIN"
    )
    db.add_all([student, admin])
    db.flush()

    # 2. Subjects
    sub_bio = Subject(id=1, name="Biology", slug="biology", icon="dna", display_order=1)
    sub_phy = Subject(id=2, name="Physics", slug="physics", icon="atom", display_order=2)
    sub_chem = Subject(id=3, name="Chemistry", slug="chemistry", icon="flask", display_order=3)
    db.add_all([sub_bio, sub_phy, sub_chem])
    db.flush()

    # 3. Chapters & Topics
    # Biology
    chap_physio = Chapter(id=101, subject_id=sub_bio.id, name="Human Physiology", slug="human-physiology", display_order=1)
    chap_genetics = Chapter(id=102, subject_id=sub_bio.id, name="Genetics & Evolution", slug="genetics-evolution", display_order=2)
    db.add_all([chap_physio, chap_genetics])
    db.flush()

    top_neural = Topic(id=1001, chapter_id=chap_physio.id, name="Neural Control & Coordination", slug="neural-control", display_order=1)
    top_excretion = Topic(id=1002, chapter_id=chap_physio.id, name="Excretory Products & Elimination", slug="excretory-products", display_order=2)
    top_mendel = Topic(id=1003, chapter_id=chap_genetics.id, name="Principles of Inheritance & Variation", slug="principles-inheritance", display_order=1)
    db.add_all([top_neural, top_excretion, top_mendel])

    # Physics
    chap_mechanics = Chapter(id=201, subject_id=sub_phy.id, name="Mechanics & Laws of Motion", slug="mechanics-laws-of-motion", display_order=1)
    chap_electro = Chapter(id=202, subject_id=sub_phy.id, name="Electrostatics & Current", slug="electrostatics-current", display_order=2)
    db.add_all([chap_mechanics, chap_electro])
    db.flush()

    top_nlm = Topic(id=2001, chapter_id=chap_mechanics.id, name="Newton's Laws of Motion & Friction", slug="newtons-laws", display_order=1)
    top_wep = Topic(id=2002, chapter_id=chap_mechanics.id, name="Work, Energy & Power", slug="work-energy-power", display_order=2)
    top_coulomb = Topic(id=2003, chapter_id=chap_electro.id, name="Electric Charges, Fields & Gauss Law", slug="electric-charges", display_order=1)
    db.add_all([top_nlm, top_wep, top_coulomb])

    # Chemistry
    chap_bonding = Chapter(id=301, subject_id=sub_chem.id, name="Chemical Bonding & Structure", slug="chemical-bonding", display_order=1)
    chap_thermo = Chapter(id=302, subject_id=sub_chem.id, name="Chemical Thermodynamics", slug="thermodynamics", display_order=2)
    db.add_all([chap_bonding, chap_thermo])
    db.flush()

    top_vsepr = Topic(id=3001, chapter_id=chap_bonding.id, name="VSEPR Theory & Hybridisation", slug="vsepr-hybridisation", display_order=1)
    top_first_law = Topic(id=3002, chapter_id=chap_thermo.id, name="First & Second Law of Thermodynamics", slug="first-second-law", display_order=1)
    db.add_all([top_vsepr, top_first_law])
    db.flush()

    # 4. Questions & Options
    questions_data = [
        # Biology - Neural
        {
            "id": "q-bio-01",
            "topic_id": top_neural.id,
            "text": "Which part of the human brain is primarily responsible for maintaining posture, equilibrium, and coordination of voluntary movements?",
            "difficulty": "EASY",
            "source": "NEET 2021",
            "year": 2021,
            "explanation": "**Cerebellum** integrates information from the inner ear, proprioceptors in muscles and joints, and the visual system to coordinate voluntary motor movements, posture, and balance.",
            "options": [
                ("A", "Cerebrum", False),
                ("B", "Cerebellum", True),
                ("C", "Medulla oblongata", False),
                ("D", "Hypothalamus", False)
            ]
        },
        {
            "id": "q-bio-02",
            "topic_id": top_neural.id,
            "text": "During the transmission of a nerve impulse across a chemical synapse, neurotransmitters are released from synaptic vesicles into the synaptic cleft triggered by the influx of which ion?",
            "difficulty": "MEDIUM",
            "source": "NEET 2022",
            "year": 2022,
            "explanation": "When an action potential arrives at the axon terminal, voltage-gated **Ca²⁺ channels** open. The influx of calcium ions triggers the exocytosis of neurotransmitter-filled vesicles into the synaptic cleft.",
            "options": [
                ("A", "Na⁺", False),
                ("B", "K⁺", False),
                ("C", "Ca²⁺", True),
                ("D", "Cl⁻", False)
            ]
        },
        # Biology - Excretion
        {
            "id": "q-bio-03",
            "topic_id": top_excretion.id,
            "text": "The functional unit of human kidney involved in the counter-current mechanism to concentrate urine is:",
            "difficulty": "MEDIUM",
            "source": "NCERT Exemplar",
            "year": 2023,
            "explanation": "The **Loop of Henle and Vasa Recta** play a crucial role in creating and maintaining an osmotic medullary gradient through the counter-current multiplier and exchange mechanisms.",
            "options": [
                ("A", "Bowman's capsule and Glomerulus", False),
                ("B", "Henle's loop and Vasa recta", True),
                ("C", "Proximal Convoluted Tubule and Distal Convoluted Tubule", False),
                ("D", "Macula densa and Juxtaglomerular cells", False)
            ]
        },
        # Biology - Genetics
        {
            "id": "q-bio-04",
            "topic_id": top_mendel.id,
            "text": "A cross between a true-breeding red-flowered snapdragon (RR) and a true-breeding white-flowered snapdragon (rr) produces pink progeny (Rr). This phenomenon is an example of:",
            "difficulty": "EASY",
            "source": "NEET 2020",
            "year": 2020,
            "explanation": "In **Incomplete Dominance** (e.g. *Antirrhinum majus* or Snapdragon), neither allele is completely dominant over the other, yielding a blending phenotype in heterozygotes (Rr = pink).",
            "options": [
                ("A", "Codominance", False),
                ("B", "Incomplete dominance", True),
                ("C", "Multiple allelism", False),
                ("D", "Pleiotropy", False)
            ]
        },
        # Physics - NLM
        {
            "id": "q-phy-01",
            "topic_id": top_nlm.id,
            "text": "A block of mass $m = 2\\text{ kg}$ rests on a rough horizontal surface with coefficient of static friction $\\mu_s = 0.4$. A horizontal force of $5\\text{ N}$ is applied. Taking $g = 10\\text{ m/s}^2$, the frictional force acting on the block is:",
            "difficulty": "MEDIUM",
            "source": "NEET 2021",
            "year": 2021,
            "explanation": "Maximum limiting static friction: $f_{max} = \\mu_s N = \\mu_s mg = 0.4 \\times 2 \\times 10 = 8\\text{ N}$. Since the applied force $F = 5\\text{ N} < f_{max}$, the block does not move. Static friction adjusts itself to equal the applied force, so $f = 5\\text{ N}$.",
            "options": [
                ("A", "8 N", False),
                ("B", "5 N", True),
                ("C", "0 N", False),
                ("D", "20 N", False)
            ]
        },
        {
            "id": "q-phy-02",
            "topic_id": top_wep.id,
            "text": "A particle of mass $m$ moves along a circular path of radius $r$ under the action of a centripetal force $F = -k/r^2$. The total mechanical energy of the particle is:",
            "difficulty": "HARD",
            "source": "NEET 2019",
            "year": 2019,
            "explanation": "Centripetal force: $\\frac{mv^2}{r} = \\frac{k}{r^2} \\implies mv^2 = \\frac{k}{r}$. Kinetic energy $K = \\frac{1}{2}mv^2 = \\frac{k}{2r}$. Potential energy $U = -\\int F \\cdot dr = -\\int \\frac{k}{r^2} dr = -\\frac{k}{r}$. Total Energy $E = K + U = \\frac{k}{2r} - \\frac{k}{r} = -\\frac{k}{2r}$.",
            "options": [
                ("A", "$-k / (2r)$", True),
                ("B", "$k / (2r)$", False),
                ("C", "$-k / r$", False),
                ("D", "Zero", False)
            ]
        },
        # Physics - Electrostatics
        {
            "id": "q-phy-03",
            "topic_id": top_coulomb.id,
            "text": "An electric dipole of dipole moment $p$ is placed in a uniform electric field $E$. The torque experienced by the dipole is maximum when the angle between $p$ and $E$ is:",
            "difficulty": "EASY",
            "source": "NEET 2023",
            "year": 2023,
            "explanation": "Torque on a dipole is given by $\\vec{\\tau} = \\vec{p} \\times \\vec{E} = pE \\sin\\theta$. Torque is maximum when $\\sin\\theta = 1$, which occurs at $\\theta = 90^\\circ$ ($\\pi/2\\text{ rad}$).",
            "options": [
                ("A", "0°", False),
                ("B", "45°", False),
                ("C", "90°", True),
                ("D", "180°", False)
            ]
        },
        # Chemistry - Chemical Bonding
        {
            "id": "q-chem-01",
            "topic_id": top_vsepr.id,
            "text": "According to VSEPR theory, the molecular geometry and hybridization of the central atom in $\\text{SF}_4$ are respectively:",
            "difficulty": "MEDIUM",
            "source": "NEET 2022",
            "year": 2022,
            "explanation": "Sulfur has 6 valence electrons. In $\\text{SF}_4$, there are 4 bond pairs and 1 lone pair (Steric Number = 5). Hybridization is $sp^3d$. With 1 lone pair in the equatorial position to minimize repulsion, the shape is **See-saw**.",
            "options": [
                ("A", "Tetrahedral, $sp^3$", False),
                ("B", "Square planar, $dsp^2$", False),
                ("C", "See-saw, $sp^3d$", True),
                ("D", "Trigonal bipyramidal, $sp^3d$", False)
            ]
        },
        {
            "id": "q-chem-02",
            "topic_id": top_vsepr.id,
            "text": "Which of the following diatomic species has a bond order of 3 and is diamagnetic in nature?",
            "difficulty": "MEDIUM",
            "source": "NEET 2020",
            "year": 2020,
            "explanation": "$\\text{N}_2$ has 14 electrons: $(\\sigma 1s)^2 (\\sigma^* 1s)^2 (\\sigma 2s)^2 (\\sigma^* 2s)^2 (\\pi 2p_x)^2 = (\\pi 2p_y)^2 (\\sigma 2p_z)^2$. Bond order $= \\frac{10 - 4}{2} = 3$. Since all electrons are paired, it is diamagnetic.",
            "options": [
                ("A", "$\\text{O}_2$", False),
                ("B", "$\\text{N}_2$", True),
                ("C", "$\\text{NO}$", False),
                ("D", "$\\text{C}_2$", False)
            ]
        },
        # Chemistry - Thermodynamics
        {
            "id": "q-chem-03",
            "topic_id": top_first_law.id,
            "text": "For a spontaneous reaction at constant temperature and pressure, the change in Gibbs Free Energy ($\\Delta G$) must satisfy:",
            "difficulty": "EASY",
            "source": "NEET 2021",
            "year": 2021,
            "explanation": "The criterion for spontaneity at constant $T$ and $P$ is $\\Delta G < 0$ (negative). If $\\Delta G = 0$, the system is at equilibrium; if $\\Delta G > 0$, the forward reaction is non-spontaneous.",
            "options": [
                ("A", "$\\Delta G > 0$", False),
                ("B", "$\\Delta G = 0$", False),
                ("C", "$\\Delta G < 0$", True),
                ("D", "$\\Delta G = \\Delta H$", False)
            ]
        }
    ]

    all_q_instances = []
    for q_dict in questions_data:
        q = Question(
            id=q_dict["id"],
            topic_id=q_dict["topic_id"],
            question_text=q_dict["text"],
            question_type="SINGLE_CHOICE",
            difficulty=q_dict["difficulty"],
            explanation=q_dict["explanation"],
            source=q_dict.get("source"),
            year=q_dict.get("year"),
            is_active=True
        )
        db.add(q)
        all_q_instances.append(q)

        for opt_key, opt_text, is_corr in q_dict["options"]:
            opt = QuestionOption(
                id=str(uuid.uuid4()),
                question_id=q.id,
                option_key=opt_key,
                option_text=opt_text,
                is_correct=is_corr
            )
            db.add(opt)

    db.flush()

    # 5. Create Pre-configured Tests
    # Test 1: Biology Chapter Test (Human Physiology)
    t1 = Test(
        id="test-bio-physio",
        title="Biology Chapter Test: Human Physiology",
        description="Comprehensive 30-minute diagnostic test assessing Neural Control and Excretion topics.",
        test_type="CHAPTER",
        duration_minutes=15,
        total_marks=12,
        positive_marks_per_q=4.0,
        negative_marks_per_q=1.0,
        is_published=True
    )
    db.add(t1)
    db.flush()

    bio_q_ids = ["q-bio-01", "q-bio-02", "q-bio-03"]
    for idx, qid in enumerate(bio_q_ids, 1):
        db.add(TestQuestion(
            id=str(uuid.uuid4()),
            test_id=t1.id,
            question_id=qid,
            section_name="Section A",
            order_index=idx
        ))

    # Test 2: Physics Chapter Test (Mechanics)
    t2 = Test(
        id="test-phy-mechanics",
        title="Physics Chapter Test: Mechanics & Motion",
        description="High-yield numerical test focusing on Newton's Laws of Motion, Friction and Work-Energy theorem.",
        test_type="CHAPTER",
        duration_minutes=15,
        total_marks=8,
        positive_marks_per_q=4.0,
        negative_marks_per_q=1.0,
        is_published=True
    )
    db.add(t2)
    db.flush()

    phy_q_ids = ["q-phy-01", "q-phy-02"]
    for idx, qid in enumerate(phy_q_ids, 1):
        db.add(TestQuestion(
            id=str(uuid.uuid4()),
            test_id=t2.id,
            question_id=qid,
            section_name="Section A",
            order_index=idx
        ))

    # Test 3: NEET-UG Multi-Subject Mini Mock 01
    t3 = Test(
        id="test-neet-mock-01",
        title="NEET-UG Multi-Subject Mini Mock 01",
        description="Simulated mock test covering Physics, Chemistry, and Biology under strict NTA marking rules (+4, -1).",
        test_type="FULL_MOCK",
        duration_minutes=30,
        total_marks=40,
        positive_marks_per_q=4.0,
        negative_marks_per_q=1.0,
        is_published=True
    )
    db.add(t3)
    db.flush()

    all_q_ids = [q["id"] for q in questions_data]
    for idx, qid in enumerate(all_q_ids, 1):
        sec = "Physics" if "phy" in qid else ("Chemistry" if "chem" in qid else "Biology")
        db.add(TestQuestion(
            id=str(uuid.uuid4()),
            test_id=t3.id,
            question_id=qid,
            section_name=sec,
            order_index=idx
        ))

    db.commit()
    print("Database seeding completed successfully.")
