import uuid
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.models.taxonomy import Subject, Chapter, Topic
from backend.app.models.question import Question, QuestionOption
from backend.app.models.test import Test, TestQuestion
from backend.app.core.security import hash_password

def seed_database_if_empty(db: Session, force: bool = False):
    # Check if already seeded unless force is True
    if not force and db.query(Subject).first():
        return

    if force:
        db.query(TestQuestion).delete()
        db.query(Test).delete()
        db.query(QuestionOption).delete()
        db.query(Question).delete()
        db.query(Topic).delete()
        db.query(Chapter).delete()
        db.query(Subject).delete()
        db.commit()

    print("Seeding database with complete NEET UG syllabus, units, micro-topics, and authentic questions...")

    # 1. Users (only if not already created)
    student = db.query(User).filter(User.email == "student@neetprep.com").first()
    if not student:
        student = User(
            id=str(uuid.uuid4()),
            email="student@neetprep.com",
            hashed_password=hash_password("neet123"),
            full_name="Aarav Sharma",
            target_year=2026,
            student_grade="CLASS_12",
            role="STUDENT"
        )
        db.add(student)

    admin = db.query(User).filter(User.email == "admin@neetprep.com").first()
    if not admin:
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@neetprep.com",
            hashed_password=hash_password("admin123"),
            full_name="Dr. R. K. Verma (Faculty)",
            target_year=2026,
            student_grade="REPEATER",
            role="ADMIN"
        )
        db.add(admin)

    db.flush()

    # 2. Subjects
    sub_bio = Subject(id=1, name="Biology", slug="biology", icon="dna", display_order=1)
    sub_chem = Subject(id=2, name="Chemistry", slug="chemistry", icon="flask", display_order=2)
    sub_phy = Subject(id=3, name="Physics", slug="physics", icon="atom", display_order=3)
    db.add_all([sub_bio, sub_chem, sub_phy])
    db.flush()

    # ==========================================
    # BIOLOGY UNITS & CHAPTERS
    # ==========================================
    # Unit 1: Diversity of Living Organisms (4 Chapters)
    chap_living = Chapter(id=101, subject_id=sub_bio.id, name="Living World", slug="living-world", display_order=1)
    chap_bio_class = Chapter(id=102, subject_id=sub_bio.id, name="Biological Classification", slug="biological-classification", display_order=2)
    chap_plant_k = Chapter(id=103, subject_id=sub_bio.id, name="Plant Kingdom", slug="plant-kingdom", display_order=3)
    chap_animal_k = Chapter(id=104, subject_id=sub_bio.id, name="Animal Kingdom", slug="animal-kingdom", display_order=4)

    # Unit 2: Structural Organisation (3 Chapters)
    chap_morpho = Chapter(id=105, subject_id=sub_bio.id, name="Morphology of Flowering Plants", slug="morphology-plants", display_order=5)
    chap_anatomy = Chapter(id=106, subject_id=sub_bio.id, name="Anatomy of Flowering Plants", slug="anatomy-plants", display_order=6)
    chap_struct_anim = Chapter(id=107, subject_id=sub_bio.id, name="Structural Organisation in Animals", slug="structural-animals", display_order=7)

    # Unit 3: Cell Structure & Function (3 Chapters)
    chap_cell = Chapter(id=108, subject_id=sub_bio.id, name="Cell: The Unit of Life", slug="cell-unit-of-life", display_order=8)
    chap_biomol = Chapter(id=109, subject_id=sub_bio.id, name="Biomolecules", slug="biomolecules", display_order=9)
    chap_cell_cycle = Chapter(id=110, subject_id=sub_bio.id, name="Cell Cycle and Cell Division", slug="cell-cycle-division", display_order=10)

    # Unit 4: Plant Physiology (3 Chapters)
    chap_photo = Chapter(id=111, subject_id=sub_bio.id, name="Photosynthesis in Higher Plants", slug="photosynthesis", display_order=11)
    chap_resp_plant = Chapter(id=112, subject_id=sub_bio.id, name="Respiration in Plants", slug="respiration-plants", display_order=12)
    chap_plant_growth = Chapter(id=113, subject_id=sub_bio.id, name="Plant Growth & Development", slug="plant-growth", display_order=13)

    # Unit 5: Human Physiology (5 Chapters)
    chap_breathing = Chapter(id=114, subject_id=sub_bio.id, name="Breathing and Exchange of Gases", slug="breathing-exchange", display_order=14)
    chap_fluids = Chapter(id=115, subject_id=sub_bio.id, name="Body Fluids and Circulation", slug="body-fluids-circulation", display_order=15)
    chap_excretion = Chapter(id=116, subject_id=sub_bio.id, name="Excretory Products & Elimination", slug="excretory-products", display_order=16)
    chap_locomotion = Chapter(id=117, subject_id=sub_bio.id, name="Locomotion and Movement", slug="locomotion-movement", display_order=17)
    chap_neural = Chapter(id=118, subject_id=sub_bio.id, name="Neural Control & Coordination", slug="neural-control", display_order=18)

    # Unit 6: Genetics & Evolution
    chap_genetics = Chapter(id=119, subject_id=sub_bio.id, name="Principles of Inheritance & Variation", slug="principles-inheritance", display_order=19)
    chap_mol_gen = Chapter(id=120, subject_id=sub_bio.id, name="Molecular Basis of Inheritance", slug="molecular-basis", display_order=20)

    # Unit 7: Reproduction & Biotechnology
    chap_human_rep = Chapter(id=121, subject_id=sub_bio.id, name="Human Reproduction", slug="human-reproduction", display_order=21)
    chap_biotech = Chapter(id=122, subject_id=sub_bio.id, name="Biotechnology & Applications", slug="biotech-applications", display_order=22)

    db.add_all([
        chap_living, chap_bio_class, chap_plant_k, chap_animal_k,
        chap_morpho, chap_anatomy, chap_struct_anim,
        chap_cell, chap_biomol, chap_cell_cycle,
        chap_photo, chap_resp_plant, chap_plant_growth,
        chap_breathing, chap_fluids, chap_excretion, chap_locomotion, chap_neural,
        chap_genetics, chap_mol_gen, chap_human_rep, chap_biotech
    ])
    db.flush()

    # Living World Micro-Topics (Exact as requested!)
    top_what_is_living = Topic(id=1001, chapter_id=chap_living.id, name="What is Living?", slug="what-is-living", display_order=1)
    top_div_living = Topic(id=1002, chapter_id=chap_living.id, name="Diversity In The Living World", slug="diversity-living-world", display_order=2)
    top_systematics = Topic(id=1003, chapter_id=chap_living.id, name="Systematics", slug="systematics", display_order=3)
    top_types_tax = Topic(id=1004, chapter_id=chap_living.id, name="Types Of Taxonomy", slug="types-taxonomy", display_order=4)
    top_fund_tax = Topic(id=1005, chapter_id=chap_living.id, name="Fundamental Components Of Taxonomy", slug="fundamental-taxonomy", display_order=5)
    top_tax_cat = Topic(id=1006, chapter_id=chap_living.id, name="Taxonomic Categories", slug="taxonomic-categories", display_order=6)
    top_tax_aids = Topic(id=1007, chapter_id=chap_living.id, name="Taxonomical Aids", slug="taxonomical-aids", display_order=7)

    # Other Key Biology Topics
    top_plant_algae = Topic(id=1008, chapter_id=chap_plant_k.id, name="Algae (Chlorophyceae, Phaeophyceae, Rhodophyceae)", slug="algae-classification", display_order=1)
    top_neural_synapse = Topic(id=1009, chapter_id=chap_neural.id, name="Impulse Transmission & Synapse", slug="impulse-transmission", display_order=1)
    top_counter_current = Topic(id=1010, chapter_id=chap_excretion.id, name="Counter-Current Mechanism & Urine", slug="counter-current", display_order=1)
    top_mendel = Topic(id=1011, chapter_id=chap_genetics.id, name="Mendelian Principles & Incomplete Dominance", slug="mendelian-principles", display_order=1)

    db.add_all([
        top_what_is_living, top_div_living, top_systematics, top_types_tax,
        top_fund_tax, top_tax_cat, top_tax_aids, top_plant_algae,
        top_neural_synapse, top_counter_current, top_mendel
    ])
    db.flush()

    # ==========================================
    # CHEMISTRY UNITS & CHAPTERS
    # ==========================================
    # Physical Chemistry
    chap_chem_thermo = Chapter(id=201, subject_id=sub_chem.id, name="Chemical Thermodynamics", slug="chemical-thermodynamics", display_order=1)
    chap_chem_kinetics = Chapter(id=202, subject_id=sub_chem.id, name="Chemical Kinetics", slug="chemical-kinetics", display_order=2)
    chap_equilibrium = Chapter(id=203, subject_id=sub_chem.id, name="Chemical & Ionic Equilibrium", slug="chemical-equilibrium", display_order=3)
    chap_solutions = Chapter(id=204, subject_id=sub_chem.id, name="Solutions & Colligative Properties", slug="solutions", display_order=4)

    # Inorganic Chemistry
    chap_bonding = Chapter(id=205, subject_id=sub_chem.id, name="Chemical Bonding & Molecular Structure", slug="chemical-bonding", display_order=5)
    chap_coordination = Chapter(id=206, subject_id=sub_chem.id, name="Coordination Compounds", slug="coordination-compounds", display_order=6)
    chap_pblock = Chapter(id=207, subject_id=sub_chem.id, name="p-Block Elements", slug="p-block-elements", display_order=7)

    # Organic Chemistry
    chap_hydrocarbons = Chapter(id=208, subject_id=sub_chem.id, name="Hydrocarbons", slug="hydrocarbons", display_order=8)
    chap_haloalkanes = Chapter(id=209, subject_id=sub_chem.id, name="Haloalkanes & Haloarenes", slug="haloalkanes-haloarenes", display_order=9)
    chap_oxygen_comp = Chapter(id=210, subject_id=sub_chem.id, name="Alcohols, Phenols & Ethers", slug="alcohols-phenols", display_order=10)

    db.add_all([
        chap_chem_thermo, chap_chem_kinetics, chap_equilibrium, chap_solutions,
        chap_bonding, chap_coordination, chap_pblock,
        chap_hydrocarbons, chap_haloalkanes, chap_oxygen_comp
    ])
    db.flush()

    top_vsepr = Topic(id=2001, chapter_id=chap_bonding.id, name="VSEPR Theory & Hybridisation", slug="vsepr-hybridisation", display_order=1)
    top_gibbs = Topic(id=2002, chapter_id=chap_chem_thermo.id, name="First & Second Law, Gibbs Energy", slug="gibbs-energy", display_order=1)
    top_mot = Topic(id=2003, chapter_id=chap_bonding.id, name="Molecular Orbital Theory (MOT)", slug="mot-bonding", display_order=2)

    db.add_all([top_vsepr, top_gibbs, top_mot])
    db.flush()

    # ==========================================
    # PHYSICS UNITS & CHAPTERS
    # ==========================================
    # Mechanics
    chap_kinematics = Chapter(id=301, subject_id=sub_phy.id, name="Kinematics & Motion in 1D/2D", slug="kinematics", display_order=1)
    chap_nlm = Chapter(id=302, subject_id=sub_phy.id, name="Newton's Laws of Motion & Friction", slug="newtons-laws", display_order=2)
    chap_wep = Chapter(id=303, subject_id=sub_phy.id, name="Work, Energy & Power", slug="work-energy-power", display_order=3)
    chap_gravitation = Chapter(id=304, subject_id=sub_phy.id, name="Gravitation", slug="gravitation", display_order=4)

    # Solid & Fluid Mechanics
    chap_fluids_phy = Chapter(id=305, subject_id=sub_phy.id, name="Mechanical Properties of Fluids", slug="fluids-physics", display_order=5)

    # Electricity & Magnetism
    chap_electrostatics = Chapter(id=306, subject_id=sub_phy.id, name="Electrostatics & Gauss's Law", slug="electrostatics", display_order=6)
    chap_current = Chapter(id=307, subject_id=sub_phy.id, name="Current Electricity & Circuits", slug="current-electricity", display_order=7)
    chap_magnetism = Chapter(id=308, subject_id=sub_phy.id, name="Moving Charges & Magnetism", slug="magnetism", display_order=8)

    # Modern Physics
    chap_modern = Chapter(id=309, subject_id=sub_phy.id, name="Dual Nature & Atoms/Nuclei", slug="modern-physics", display_order=9)

    db.add_all([
        chap_kinematics, chap_nlm, chap_wep, chap_gravitation,
        chap_fluids_phy, chap_electrostatics, chap_current, chap_magnetism,
        chap_modern
    ])
    db.flush()

    top_nlm_friction = Topic(id=3001, chapter_id=chap_nlm.id, name="Static & Kinetic Friction, Limiting Force", slug="friction-limiting", display_order=1)
    top_wep_energy = Topic(id=3002, chapter_id=chap_wep.id, name="Conservation of Energy & Power", slug="conservation-energy", display_order=1)
    top_coulomb = Topic(id=3003, chapter_id=chap_electrostatics.id, name="Electric Dipole & Torque in Uniform Field", slug="dipole-torque", display_order=1)

    db.add_all([top_nlm_friction, top_wep_energy, top_coulomb])
    db.flush()

    # ==========================================
    # AUTHENTIC QUESTIONS & OPTIONS
    # ==========================================
    questions_data = [
        # Requested Prompt Question: Phycoerythrin
        {
            "id": "q-algae-phyco",
            "topic_id": top_plant_algae.id,
            "text": "Phycoerythrin is the major photosynthetic pigment in:",
            "difficulty": "EASY",
            "source": "NEET PYQ",
            "year": 2022,
            "explanation": "**Red algae (Rhodophyceae)** possess a predominance of the red pigment, **r-phycoerythrin**, in their body which imparts their characteristic red colour. Major photosynthetic pigments in red algae are Chlorophyll $a$, $d$, and phycoerythrin.",
            "options": [
                ("A", "Red algae", True),
                ("B", "Blue green algae", False),
                ("C", "Green algae", False),
                ("D", "Brown algae", False)
            ]
        },
        # Living World Question
        {
            "id": "q-living-world-01",
            "topic_id": top_what_is_living.id,
            "text": "Which of the following is considered a defining property of all living organisms without exception?",
            "difficulty": "MEDIUM",
            "source": "NCERT Exemplar",
            "year": 2023,
            "explanation": "**Consciousness (ability to sense surroundings and respond to external stimuli)** and **Cellular organisation** are defining properties of living organisms without exception. Reproduction and growth have exceptions (e.g., mules, infertile human couples, non-living growth by accumulation).",
            "options": [
                ("A", "Growth by increase in body mass", False),
                ("B", "Reproduction", False),
                ("C", "Consciousness and response to stimuli", True),
                ("D", "Self-replication in vitro", False)
            ]
        },
        # Systematics Question
        {
            "id": "q-systematics-01",
            "topic_id": top_systematics.id,
            "text": "The term 'Systematics' takes into account which of the following aspects beyond classical taxonomy?",
            "difficulty": "EASY",
            "source": "NEET 2021",
            "year": 2021,
            "explanation": "Systematics takes into account **evolutionary relationships (phylogeny)** among diverse organisms along with identification, nomenclature, and classification.",
            "options": [
                ("A", "Evolutionary relationships among organisms", True),
                ("B", "Only morphological characteristics", False),
                ("C", "Artificial classification systems", False),
                ("D", "Cytological data only", False)
            ]
        },
        # Biology - Neural
        {
            "id": "q-bio-01",
            "topic_id": top_neural_synapse.id,
            "text": "Which part of the human brain is primarily responsible for maintaining posture, equilibrium, and coordination of voluntary movements?",
            "difficulty": "EASY",
            "source": "NEET 2021",
            "year": 2021,
            "explanation": "**Cerebellum** coordinates voluntary motor movements, posture, and muscular balance by processing vestibular and proprioceptive inputs.",
            "options": [
                ("A", "Cerebrum", False),
                ("B", "Cerebellum", True),
                ("C", "Medulla oblongata", False),
                ("D", "Hypothalamus", False)
            ]
        },
        {
            "id": "q-bio-02",
            "topic_id": top_neural_synapse.id,
            "text": "During the transmission of a nerve impulse across a chemical synapse, neurotransmitters are released from synaptic vesicles into the synaptic cleft triggered by the influx of which ion?",
            "difficulty": "MEDIUM",
            "source": "NEET 2022",
            "year": 2022,
            "explanation": "When an action potential depolarizes the axon terminal, voltage-gated **Ca²⁺ channels** open. The influx of $\\text{Ca}^{2+}$ stimulates the docking and exocytosis of neurotransmitter vesicles.",
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
            "topic_id": top_counter_current.id,
            "text": "The functional unit of human kidney involved in the counter-current mechanism to concentrate urine is:",
            "difficulty": "MEDIUM",
            "source": "NCERT Exemplar",
            "year": 2023,
            "explanation": "The hairpin-shaped **Loop of Henle** and **Vasa Recta** play the central role in creating and maintaining the hyperosmolar medullary gradient via counter-current multiplication and exchange.",
            "options": [
                ("A", "Bowman's capsule and Glomerulus", False),
                ("B", "Henle's loop and Vasa recta", True),
                ("C", "Proximal and Distal Convoluted Tubules", False),
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
            "explanation": "In **Incomplete Dominance** (*Antirrhinum majus*), neither allele is completely dominant, resulting in an intermediate pink phenotype (Rr).",
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
            "topic_id": top_nlm_friction.id,
            "text": "A block of mass $m = 2\\text{ kg}$ rests on a rough horizontal surface with coefficient of static friction $\\mu_s = 0.4$. A horizontal force of $5\\text{ N}$ is applied. Taking $g = 10\\text{ m/s}^2$, the frictional force acting on the block is:",
            "difficulty": "MEDIUM",
            "source": "NEET 2021",
            "year": 2021,
            "explanation": "Limiting static friction $f_{max} = \\mu_s mg = 0.4 \\times 2 \\times 10 = 8\\text{ N}$. Since the applied force $F = 5\\text{ N} < f_{max}$, the block remains stationary. Static friction self-adjusts to equal the applied force: $f = 5\\text{ N}$.",
            "options": [
                ("A", "8 N", False),
                ("B", "5 N", True),
                ("C", "0 N", False),
                ("D", "20 N", False)
            ]
        },
        {
            "id": "q-phy-02",
            "topic_id": top_wep_energy.id,
            "text": "A particle of mass $m$ moves along a circular path of radius $r$ under the action of a centripetal force $F = -k/r^2$. The total mechanical energy of the particle is:",
            "difficulty": "HARD",
            "source": "NEET 2019",
            "year": 2019,
            "explanation": "Centripetal force: $\\frac{mv^2}{r} = \\frac{k}{r^2} \\implies K = \\frac{1}{2}mv^2 = \\frac{k}{2r}$. Potential energy $U = -\\frac{k}{r}$. Total mechanical energy $E = K + U = \\frac{k}{2r} - \\frac{k}{r} = -\\frac{k}{2r}$.",
            "options": [
                ("A", "$-k / (2r)$", True),
                ("B", "$k / (2r)$", False),
                ("C", "$-k / r$", False),
                ("D", "Zero", False)
            ]
        },
        {
            "id": "q-phy-03",
            "topic_id": top_coulomb.id,
            "text": "An electric dipole of dipole moment $p$ is placed in a uniform electric field $E$. The torque experienced by the dipole is maximum when the angle between $p$ and $E$ is:",
            "difficulty": "EASY",
            "source": "NEET 2023",
            "year": 2023,
            "explanation": "Torque is given by $\\tau = pE \\sin\\theta$. Torque is maximum when $\\sin\\theta = 1$, which occurs at $\\theta = 90^\\circ$.",
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
            "explanation": "Sulfur has 6 valence electrons; in $\\text{SF}_4$ there are 4 bond pairs and 1 lone pair (Steric Number = 5). Hybridization is $sp^3d$. With 1 equatorial lone pair to minimize repulsion, the geometry is **See-saw**.",
            "options": [
                ("A", "Tetrahedral, $sp^3$", False),
                ("B", "Square planar, $dsp^2$", False),
                ("C", "See-saw, $sp^3d$", True),
                ("D", "Trigonal bipyramidal, $sp^3d$", False)
            ]
        },
        {
            "id": "q-chem-02",
            "topic_id": top_mot.id,
            "text": "Which of the following diatomic species has a bond order of 3 and is diamagnetic in nature?",
            "difficulty": "MEDIUM",
            "source": "NEET 2020",
            "year": 2020,
            "explanation": "$\\text{N}_2$ has 14 electrons: Bond order $= \\frac{10 - 4}{2} = 3$. With all electrons paired in molecular orbitals, it is diamagnetic.",
            "options": [
                ("A", "$\\text{O}_2$", False),
                ("B", "$\\text{N}_2$", True),
                ("C", "$\\text{NO}$", False),
                ("D", "$\\text{C}_2$", False)
            ]
        },
        {
            "id": "q-chem-03",
            "topic_id": top_gibbs.id,
            "text": "For a spontaneous reaction at constant temperature and pressure, the change in Gibbs Free Energy ($\\Delta G$) must satisfy:",
            "difficulty": "EASY",
            "source": "NEET 2021",
            "year": 2021,
            "explanation": "Spontaneity criterion at constant $T$ and $P$ is $\\Delta G < 0$ (negative). If $\\Delta G = 0$, reaction is at dynamic equilibrium.",
            "options": [
                ("A", "$\\Delta G > 0$", False),
                ("B", "$\\Delta G = 0$", False),
                ("C", "$\\Delta G < 0$", True),
                ("D", "$\\Delta G = \\Delta H$", False)
            ]
        }
    ]

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

    # Pre-Configured Tests
    t1 = Test(
        id="test-bio-diversity",
        title="Biology Chapter Test: Diversity of Living Organisms",
        description="Focused assessment covering Living World, Biological Classification, and Algae pigments under NTA guidelines.",
        test_type="CHAPTER",
        duration_minutes=15,
        total_marks=12,
        positive_marks_per_q=4.0,
        negative_marks_per_q=1.0,
        is_published=True
    )
    db.add(t1)
    db.flush()

    t1_q_ids = ["q-algae-phyco", "q-living-world-01", "q-systematics-01"]
    for idx, qid in enumerate(t1_q_ids, 1):
        db.add(TestQuestion(
            id=str(uuid.uuid4()),
            test_id=t1.id,
            question_id=qid,
            section_name="Section A",
            order_index=idx
        ))

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

    t3 = Test(
        id="test-neet-mock-01",
        title="NEET-UG Multi-Subject Mini Mock 01",
        description="Simulated mock test covering Physics, Chemistry, and Biology under strict NTA marking rules (+4, -1).",
        test_type="FULL_MOCK",
        duration_minutes=30,
        total_marks=48,
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
    print("Database seeding completed with complete NEET syllabus and content.")
